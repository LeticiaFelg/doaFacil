// src/utils/dynamoClient.js
// Cliente DynamoDB reutilizado em todos os models.
// Em Lambda, as credenciais vêm automaticamente da IAM Role.
// Em desenvolvimento local, vêm das variáveis de ambiente.

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  // Se AWS_ACCESS_KEY_ID estiver definida (dev local), usa. Em Lambda, omite.
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

// DynamoDBDocumentClient converte automaticamente tipos JS <-> DynamoDB
const dynamo = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

module.exports = dynamo;
