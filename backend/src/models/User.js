// src/models/User.js
// Encapsula todas as operações DynamoDB relacionadas a usuários.

const {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const dynamo = require('../utils/dynamoClient');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const TABLE       = process.env.DYNAMODB_TABLE_USERS || 'doafacil_users';
const SALT_ROUNDS = 10;

const UserModel = {
  /**
   * Cria um novo usuário.
   * @param {{ name, email, password, phone, address, profileType }} data
   */
  async create(data) {
    const { name, email, password, phone, address, profileType = 'both' } = data;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();

    const user = {
      userId:       uuidv4(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash,
      phone:        phone  || null,
      address:      address || {},   // { street, neighborhood, city, state }
      profileType,                   // 'donor' | 'receiver' | 'both'
      createdAt:    now,
      updatedAt:    now,
    };

    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: user,
      // Impede que um e-mail já cadastrado seja sobrescrito
      ConditionExpression: 'attribute_not_exists(email)',
    }));

    return UserModel._sanitize(user);
  },

  /**
   * Busca usuário por ID (sem o hash da senha).
   */
  async findById(userId) {
    const { Item } = await dynamo.send(new GetCommand({
      TableName: TABLE,
      Key: { userId },
    }));
    return Item ? UserModel._sanitize(Item) : null;
  },

  /**
   * Busca usuário por ID retornando o hash (uso interno: troca de senha).
   */
  async findByIdWithHash(userId) {
    const { Item } = await dynamo.send(new GetCommand({
      TableName: TABLE,
      Key: { userId },
    }));
    return Item || null;
  },

  /**
   * Busca usuário por e-mail retornando o hash (uso interno: login).
   */
  async findByEmailWithHash(email) {
    const { Items } = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase().trim() },
    }));
    return Items?.[0] || null;
  },

  /**
   * Atualiza dados do perfil.
   * Campos permitidos: name, phone, address, profileType.
   * Senha tem rota própria: updatePassword().
   */
  async update(userId, updates) {
    const allowed = ['name', 'phone', 'address', 'profileType'];
    const toUpdate = {};

    for (const key of allowed) {
      if (updates[key] !== undefined) toUpdate[key] = updates[key];
    }

    if (Object.keys(toUpdate).length === 0) {
      throw new Error('Nenhum campo válido para atualizar.');
    }

    toUpdate.updatedAt = new Date().toISOString();

    const setExpression    = Object.keys(toUpdate).map((k) => `#${k} = :${k}`).join(', ');
    const expressionNames  = Object.keys(toUpdate).reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
    const expressionValues = Object.keys(toUpdate).reduce((acc, k) => ({ ...acc, [`:${k}`]: toUpdate[k] }), {});

    const { Attributes } = await dynamo.send(new UpdateCommand({
      TableName: TABLE,
      Key: { userId },
      UpdateExpression: `SET ${setExpression}`,
      ExpressionAttributeNames:  expressionNames,
      ExpressionAttributeValues: expressionValues,
      ConditionExpression: 'attribute_exists(userId)',
      ReturnValues: 'ALL_NEW',
    }));

    return UserModel._sanitize(Attributes);
  },

  /**
   * Atualiza a senha do usuário.
   * A verificação da senha atual é feita na rota, não aqui.
   */
  async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const now = new Date().toISOString();

    await dynamo.send(new UpdateCommand({
      TableName: TABLE,
      Key: { userId },
      UpdateExpression: 'SET passwordHash = :hash, updatedAt = :now',
      ExpressionAttributeValues: { ':hash': passwordHash, ':now': now },
      ConditionExpression: 'attribute_exists(userId)',
    }));
  },

  /**
   * Deleta o usuário permanentemente.
   */
  async delete(userId) {
    await dynamo.send(new DeleteCommand({
      TableName: TABLE,
      Key: { userId },
      ConditionExpression: 'attribute_exists(userId)',
    }));
    return true;
  },

  /**
   * Remove passwordHash antes de retornar dados ao cliente.
   */
  _sanitize(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  },
};

// src/models/User.js

const db     = require('../utils/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 10;

const UserModel = {

  async create({ name, email, password, phone, address = {}, profileType = 'both' }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const now    = new Date().toISOString();
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users
        (userId, name, email, passwordHash, phone, street, neighborhood, city, state, profileType, createdAt, updatedAt)
      VALUES
        (@userId, @name, @email, @passwordHash, @phone, @street, @neighborhood, @city, @state, @profileType, @createdAt, @updatedAt)
    `).run({
      userId,
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash,
      phone:        phone || null,
      street:       address.street       || null,
      neighborhood: address.neighborhood || null,
      city:         address.city         || null,
      state:        address.state        || null,
      profileType,
      createdAt:    now,
      updatedAt:    now,
    });

    return UserModel._sanitize(UserModel._findRaw(userId));
  },

  findById(userId) {
    const row = UserModel._findRaw(userId);
    return row ? UserModel._sanitize(row) : null;
  },

  findByIdWithHash(userId) {
    return UserModel._findRaw(userId) || null;
  },

  findByEmailWithHash(email) {
    return db.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).get(email.toLowerCase().trim()) || null;
  },

  async update(userId, updates) {
    const allowed = ['name', 'phone', 'profileType'];
    const fields  = {};

    for (const key of allowed) {
      if (updates[key] !== undefined) fields[key] = updates[key];
    }

    // Endereço é tratado separado (vem como objeto)
    if (updates.address) {
      const a = updates.address;
      if (a.street       !== undefined) fields.street       = a.street;
      if (a.neighborhood !== undefined) fields.neighborhood = a.neighborhood;
      if (a.city         !== undefined) fields.city         = a.city;
      if (a.state        !== undefined) fields.state        = a.state;
    }

    if (Object.keys(fields).length === 0) {
      throw new Error('Nenhum campo válido para atualizar.');
    }

    fields.updatedAt = new Date().toISOString();

    const setClause = Object.keys(fields).map((k) => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE users SET ${setClause} WHERE userId = @userId`)
      .run({ ...fields, userId });

    return UserModel.findById(userId);
  },

  async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    db.prepare(`
      UPDATE users SET passwordHash = ?, updatedAt = ? WHERE userId = ?
    `).run(passwordHash, new Date().toISOString(), userId);
  },

  delete(userId) {
    db.prepare('DELETE FROM users WHERE userId = ?').run(userId);
    return true;
  },

  // ── Privados ─────────────────────────────────────────────
  _findRaw(userId) {
    return db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
  },

  _sanitize(row) {
    if (!row) return null;
    const { passwordHash, street, neighborhood, city, state, ...rest } = row;
    return {
      ...rest,
      address: { street, neighborhood, city, state },
    };
  },
};

module.exports = UserModel;