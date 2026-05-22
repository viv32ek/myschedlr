const { GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../db/dynamodb');

const TABLE = process.env.DYNAMODB_USERS_TABLE || 'myschedlr-users';

/**
 * DynamoDB key design:
 *   pk  = USER#<email>   (partition key — enables look-up by email)
 *   sk  = #METADATA
 *   id  = uuid           (stored as attribute; used in JWT sub)
 */

const userKey = (email) => ({ pk: `USER#${email}`, sk: '#METADATA' });

const createUser = async ({ id, email, name, role, passwordHash, createdAt }) => {
  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: { ...userKey(email), id, email, name, role, passwordHash, createdAt },
    ConditionExpression: 'attribute_not_exists(pk)',
  }));
};

const getUserByEmail = async (email) => {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE,
    Key: userKey(email),
  }));
  return Item ?? null;
};

const getUserById = async (id) => {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE,
    IndexName: 'id-index',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
    Limit: 1,
  }));
  return Items?.[0] ?? null;
};

module.exports = { createUser, getUserByEmail, getUserById };
