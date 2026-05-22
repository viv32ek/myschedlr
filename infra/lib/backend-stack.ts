import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
  usersTable: dynamodb.Table;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, containerInsights: true });

    const repository = new ecr.Repository(this, 'BackendRepo', {
      repositoryName: 'myschedlr-backend',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'BackendService', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
        containerPort: 4000,
        environment: {
          PORT: '4000',
          AWS_REGION: this.region,
          DYNAMODB_USERS_TABLE: props.usersTable.tableName,
        },
        secrets: {
          // Populate from SSM Parameter Store or Secrets Manager
          // JWT_SECRET: ecs.Secret.fromSsmParameter(...)
        },
      },
      publicLoadBalancer: true,
    });

    // Allow ECS task role to read/write the DynamoDB table
    props.usersTable.grantReadWriteData(service.taskDefinition.taskRole);

    // Health check
    service.targetGroup.configureHealthCheck({ path: '/health' });

    // Auto-scaling
    const scaling = service.service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 10 });
    scaling.scaleOnCpuUtilization('CpuScaling', { targetUtilizationPercent: 70 });

    new cdk.CfnOutput(this, 'LoadBalancerUrl', { value: `http://${service.loadBalancer.loadBalancerDnsName}` });
    new cdk.CfnOutput(this, 'EcrRepositoryUri', { value: repository.repositoryUri });
  }
}
