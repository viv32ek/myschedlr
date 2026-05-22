const { GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../db/dynamodb');

/**
 * Table-per-tenant silo model.
 * Each tenant's data lives in its own DynamoDB table — zero cross-tenant data access.
 *
 * Table name pattern: myschedlr-{tenantId}-users
 *
 * Key design:
 *   pk  = USER#<email>   (partition key — look-up by email)
 *   sk  = #METADATA      (sort key)
 *   id  = uuid           (stored attribute — used in JWT sub / id-index)
 */
const tableName = (tenantId) => `myschedlr-${tenantId}-users`;

const userKey = (email) => ({ pk: `USER#${email}`, sk: '#METADATA' });

const createUser = async (tenantId, { id, email, name, role, passwordHash, createdAt }) => {
  await docClient.send(new PutCommand({
    TableName: tableName(tenantId),
    Item: { ...userKey(email), id, email, name, role, passwordHash, createdAt, tenantId },
    ConditionExpression: 'attribute_not_exists(pk)',
  }));
};

const getUserByEmail = async (tenantId, email) => {
  const { Item } = await docClient.send(new GetCommand({
    TableName: tableName(tenantId),
    Key: userKey(email),
  }));
  return Item ?? null;
};

const getUserById = async (tenantId, id) => {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: tableName(tenantId),
    IndexName: 'id-index',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
    Limit: 1,
  }));
  return Items?.[0] ?? null;
};

module.exports = { createUser, getUserByEmail, getUserById, tableName };

