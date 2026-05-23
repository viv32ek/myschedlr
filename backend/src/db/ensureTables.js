const { CreateTableCommand, DescribeTableCommand, DynamoDBClient } = require('@aws-sdk/client-dynamodb');

/**
 * Ensures the tenant user table exists in DynamoDB Local.
 * Only runs when DYNAMODB_ENDPOINT is set (local dev).
 * No-ops in production (table is managed by CDK).
 */
const ensureTable = async (tenantId) => {
  if (!process.env.DYNAMODB_ENDPOINT) return;

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  });

  const TableName = `myschedlr-${tenantId}-users`;

  try {
    await client.send(new DescribeTableCommand({ TableName }));
    console.log(`Table ${TableName} already exists`);
  } catch (err) {
    if (err.name !== 'ResourceNotFoundException') throw err;

    await client.send(new CreateTableCommand({
      TableName,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'id-index',
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
    }));
    console.log(`Created table ${TableName}`);
  }
};

module.exports = { ensureTable };
