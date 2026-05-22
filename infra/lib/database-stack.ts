import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Users table
     * pk  = USER#<email>  (partition key)
     * sk  = #METADATA     (sort key)
     * GSI: id-index on `id` attribute — used for JWT sub → user lookup
     */
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'myschedlr-users',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey:      { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'id-index',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(this, 'UsersTableName', { value: this.usersTable.tableName });
  }
}
