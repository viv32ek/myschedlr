const {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  BatchWriteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../db/dynamodb');

/**
 * Table-per-tenant silo model.
 * Each tenant's data lives in its own DynamoDB table.
 *
 * Table: myschedlr-{tenantId}-users
 *
 * Item types:
 *   pk = USER#{email}  sk = #METADATA          → user profile
 *   pk = USER#{email}  sk = GRANT#{scope}#{id}  → delegated scope access grant
 *
 * GSIs:
 *   id-index          → pk=id (Cognito sub) for JWT resolution
 *   grant-scope-index → pk=scopeKey for "who has access to scope X?" queries
 */
const tableName = (tenantId) => `myschedlr-${tenantId}-users`;

const userKey = (email) => ({ pk: `USER#${email.toLowerCase()}`, sk: '#METADATA' });

const grantSk = (scope, scopeId) => `GRANT#${scope}#${scopeId}`;

/** Resolve Cognito JWT sub → user profile via id-index GSI. */
const getUserBySub = async (tenantId, sub) => {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: tableName(tenantId),
    IndexName: 'id-index',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': sub },
    Limit: 1,
  }));
  return Items?.[0] ?? null;
};

/** Look up user by email (primary key). */
const getUserByEmail = async (tenantId, email) => {
  const { Item } = await docClient.send(new GetCommand({
    TableName: tableName(tenantId),
    Key: userKey(email),
  }));
  return Item ?? null;
};

/** Create a new user profile (called from POST /auth/provision). */
const createUser = async (tenantId, { sub, email, name, roles = ['student'] }) => {
  const now = new Date().toISOString();
  const item = {
    ...userKey(email),
    id: sub,
    email: email.toLowerCase(),
    name,
    roles,
    tenantId,
    createdAt: now,
    updatedAt: now,
  };
  await docClient.send(new PutCommand({
    TableName: tableName(tenantId),
    Item: item,
    ConditionExpression: 'attribute_not_exists(pk)',
  }));
  return item;
};

/** Update allowed profile fields. Returns the updated item. */
const updateUser = async (tenantId, email, updates) => {
  const allowed = ['name', 'roles', 'adminType', 'tenancyAccess'];
  const sets = [];
  const names = {};
  const values = {};

  for (const field of allowed) {
    if (updates[field] !== undefined) {
      sets.push(`#${field} = :${field}`);
      names[`#${field}`] = field;
      values[`:${field}`] = updates[field];
    }
  }
  if (sets.length === 0) return getUserByEmail(tenantId, email);

  sets.push('#updatedAt = :updatedAt');
  names['#updatedAt'] = 'updatedAt';
  values[':updatedAt'] = new Date().toISOString();

  const { Attributes } = await docClient.send(new UpdateCommand({
    TableName: tableName(tenantId),
    Key: userKey(email),
    UpdateExpression: `SET ${sets.join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ConditionExpression: 'attribute_exists(pk)',
    ReturnValues: 'ALL_NEW',
  }));
  return Attributes;
};

/** Delete a user and all their grant items. */
const deleteUser = async (tenantId, email) => {
  const table = tableName(tenantId);
  const lowerEmail = email.toLowerCase();

  const { Items = [] } = await docClient.send(new QueryCommand({
    TableName: table,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: { ':pk': `USER#${lowerEmail}`, ':prefix': 'GRANT#' },
    ProjectionExpression: 'pk, sk',
  }));

  const allKeys = [
    { pk: `USER#${lowerEmail}`, sk: '#METADATA' },
    ...Items.map((item) => ({ pk: item.pk, sk: item.sk })),
  ];

  // BatchWrite max 25 items per call
  for (let i = 0; i < allKeys.length; i += 25) {
    const chunk = allKeys.slice(i, i + 25);
    await docClient.send(new BatchWriteCommand({
      RequestItems: {
        [table]: chunk.map((key) => ({ DeleteRequest: { Key: key } })),
      },
    }));
  }
};

/** List all user profiles (excludes grant items). */
const listUsers = async (tenantId) => {
  const { Items } = await docClient.send(new ScanCommand({
    TableName: tableName(tenantId),
    FilterExpression: 'sk = :meta',
    ExpressionAttributeValues: { ':meta': '#METADATA' },
  }));
  return Items ?? [];
};

module.exports = {
  getUserBySub,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  tableName,
  userKey,
  grantSk,
};

