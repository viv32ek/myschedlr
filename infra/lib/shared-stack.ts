import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

/**
 * SharedStack — provisioned once per region.
 * Tenants share: VPC, ECS Cluster, ECR repo, ALB.
 * Each tenant gets its own ECS Service + listener rule, DynamoDB tables, S3 + CloudFront.
 */
export class SharedStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  public readonly repository: ecr.Repository;
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly httpsListener: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      containerInsights: true,
    });

    this.repository = new ecr.Repository(this, 'BackendRepo', {
      repositoryName: 'myschedlr-backend',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc: this.vpc,
      internetFacing: true,
    });

    // HTTP → HTTPS redirect
    this.alb.addListener('HttpListener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.redirect({ protocol: 'HTTPS', port: '443', permanent: true }),
    });

    // HTTPS listener — tenant rules are added by each TenantStack
    this.httpsListener = this.alb.addListener('HttpsListener', {
      port: 443,
      // Certificate added per tenant or via ACM wildcard — set via context
      certificates: [], // populate with ACM cert ARNs
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'application/json',
        messageBody: JSON.stringify({ message: 'Unknown tenant' }),
      }),
      open: true,
    });

    new cdk.CfnOutput(this, 'AlbDns', { value: this.alb.loadBalancerDnsName });
    new cdk.CfnOutput(this, 'EcrUri', { value: this.repository.repositoryUri });
  }
}
