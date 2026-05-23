const { GetCommand, PutCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../db/dynamodb');
const { tableName, grantSk } = require('./user');

/**
 * Allowed write permissions per scope.
 * RO is always the baseline — permissions listed here are extras granted on top.
 */
const VALID_PERMISSIONS = {
  course: ['edit_course', 'manage_batches', 'manage_schedules'],
  school: ['edit_school', 'manage_batches', 'manage_schedules'],
  batch:  ['edit_batch', 'manage_schedules'],
};

const VALID_SCOPES = Object.keys(VALID_PERMISSIONS);

/** List all grants for a user (sk begins_with GRANT#). */
const getGrantsForUser = async (tenantId, email) => {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: tableName(tenantId),
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: {
      ':pk':     `USER#${email.toLowerCase()}`,
      ':prefix': 'GRANT#',
    },
  }));
  return Items ?? [];
};

/** Get a single grant by scope + scopeId. */
const getGrant = async (tenantId, email, scope, scopeId) => {
  const { Item } = await docClient.send(new GetCommand({
    TableName: tableName(tenantId),
    Key: { pk: `USER#${email.toLowerCase()}`, sk: grantSk(scope, scopeId) },
  }));
  return Item ?? null;
};

/** Create or replace a grant (idempotent PUT). */
const putGrant = async (tenantId, email, { scope, scopeId, permissions = [], grantedBy }) => {
  const item = {
    pk:          `USER#${email.toLowerCase()}`,
    sk:          grantSk(scope, scopeId),
    granteeEmail: email.toLowerCase(),
    scope,
    scopeId,
    scopeKey:    `${scope}#${scopeId}`,
    permissions,
    grantedBy,
    grantedAt:   new Date().toISOString(),
  };
  await docClient.send(new PutCommand({
    TableName: tableName(tenantId),
    Item: item,
  }));
  return item;
};

/** Revoke a grant. Throws ConditionalCheckFailedException if not found. */
const deleteGrant = async (tenantId, email, scope, scopeId) => {
  await docClient.send(new DeleteCommand({
    TableName: tableName(tenantId),
    Key: { pk: `USER#${email.toLowerCase()}`, sk: grantSk(scope, scopeId) },
    ConditionExpression: 'attribute_exists(pk)',
  }));
};

module.exports = { getGrantsForUser, getGrant, putGrant, deleteGrant, VALID_PERMISSIONS, VALID_SCOPES };
