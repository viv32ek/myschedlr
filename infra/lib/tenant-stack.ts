import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export interface TenantConfig {
  /** Short identifier used in resource names and JWT tid claim, e.g. "acme" */
  id: string;
  /** DNS subdomain, e.g. "acme" → acme.myschedlr.com */
  subdomain: string;
  region: string;
}

interface TenantStackProps extends cdk.StackProps {
  tenant: TenantConfig;
  vpc: ec2.Vpc;
  cluster: ecs.Cluster;
  repository: ecr.Repository;
  httpsListener: elbv2.ApplicationListener;
  /** Priority must be unique across all tenant rules on the shared ALB listener */
  listenerPriority: number;
}

/**
 * TenantStack — one instance per tenant.
 *
 * Data isolation: each tenant gets its own DynamoDB tables.
 * Table name pattern: myschedlr-{tenantId}-users
 *
 * Compute isolation: each tenant gets its own ECS service + ALB host-based rule.
 * The same Docker image is used; TENANT_ID env var scopes it to this tenant.
 *
 * UI isolation: each tenant gets its own S3 bucket + CloudFront distribution.
 */
export class TenantStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TenantStackProps) {
    super(scope, id, props);

    const { tenant } = props;
    const prefix = `myschedlr-${tenant.id}`;

    // ── Cognito User Pool (one per tenant — complete auth silo) ──────────────
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${prefix}-users`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // SPA/mobile clients use SRP auth flow and have no client secret
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: { userSrp: true },
      generateSecret: false,
    });

    // ── DynamoDB tables (one per tenant — app profile data silo) ─────────────
    //
    // Key design: pk = USER#<cognitoSub>, sk = #METADATA
    // Profile is lazily created on first GET /users/me; passwords are in Cognito.
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `${prefix}-users`,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey:      { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,  // never auto-delete tenant data
      pointInTimeRecovery: true,
    });

    // ── ECS Fargate service ───────────────────────────────────────────────────
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDef.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, 'latest'),
      portMappings: [{ containerPort: 4000 }],
      environment: {
        PORT: '4000',
        AWS_REGION: this.region,
        // Locks this ECS deployment to this tenant — no header/subdomain resolution needed
        TENANT_ID: tenant.id,
        // Cognito User Pool for JWT verification — no shared secret needed
        COGNITO_USER_POOL_ID: userPool.userPoolId,
        COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
        COGNITO_REGION: this.region,
      },
      secrets: {},
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: prefix }),
    });

    usersTable.grantReadWriteData(taskDef.taskRole);

    const service = new ecs.FargateService(this, 'Service', {
      cluster: props.cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // ALB target group for this tenant
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc: props.vpc,
      port: 4000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: { path: '/health' },
    });

    // Host-based routing: acme.myschedlr.com → this service
    props.httpsListener.addTargetGroups(`${tenant.id}Rule`, {
      priority: props.listenerPriority,
      conditions: [elbv2.ListenerCondition.hostHeaders([`${tenant.subdomain}.*`])],
      targetGroups: [targetGroup],
    });

    // Auto-scaling
    const scaling = service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 10 });
    scaling.scaleOnCpuUtilization('CpuScaling', { targetUtilizationPercent: 70 });

    // ── S3 + CloudFront (per-tenant UI) ───────────────────────────────────────
    const bucket = new s3.Bucket(this, 'UiBucket', {
      bucketName: `${prefix}-ui`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const distribution = new cloudfront.Distribution(this, 'UiDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
      defaultRootObject: 'index.html',
      comment: `${prefix} UI`,
    });

    new s3deploy.BucketDeployment(this, 'UiDeploy', {
      sources: [s3deploy.Source.asset('../ui/dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // ── Outputs ───────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'UserPoolId',       { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'UsersTableName',   { value: usersTable.tableName });
    new cdk.CfnOutput(this, 'CloudFrontUrl',    { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, 'UiBucketName',     { value: bucket.bucketName });
  }
}
