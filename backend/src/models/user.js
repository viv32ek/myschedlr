const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../db/dynamodb');

/**
 * Table-per-tenant silo model.
 * Each tenant's data lives in its own DynamoDB table — zero cross-tenant data access.
 *
 * Table name pattern: myschedlr-{tenantId}-users
 *
 * Key design:
 *   pk  = USER#<cognitoSub>   (partition key — Cognito user unique identifier)
 *   sk  = #METADATA           (sort key)
 *
 * Passwords are managed by Cognito — no passwordHash stored here.
 * Profile is lazily created on first GET /users/me.
 */
const tableName = (tenantId) => `myschedlr-${tenantId}-users`;

const userKey = (sub) => ({ pk: `USER#${sub}`, sk: '#METADATA' });

/**
 * Returns the existing profile or creates a minimal one on first call.
 */
const getOrCreateUser = async (tenantId, { sub, role }) => {
  const { Item } = await docClient.send(new GetCommand({
    TableName: tableName(tenantId),
    Key: userKey(sub),
  }));
  if (Item) return Item;

  const user = {
    ...userKey(sub),
    id: sub,
    role,
    tenantId,
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({
    TableName: tableName(tenantId),
    Item: user,
    ConditionExpression: 'attribute_not_exists(pk)',
  }));
  return user;
};

module.exports = { getOrCreateUser, tableName };

