const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const clientConfig = { region: process.env.AWS_REGION || 'ap-south-1' };

// DynamoDB Local support for local dev
if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  clientConfig.credentials = { accessKeyId: 'local', secretAccessKey: 'local' };
}

const raw = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

module.exports = { docClient };
