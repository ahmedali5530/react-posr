'use strict';

const { Surreal } = require('surrealdb');

async function createConnectedClient(label, connectionConfig, logger) {
  const client = new Surreal();
  await client.connect(connectionConfig.url);
  await client.signin({
    username: connectionConfig.user,
    password: connectionConfig.pass,
  });
  await client.use({
    namespace: connectionConfig.ns,
    database: connectionConfig.db,
  });

  logger.info(`${label} SurrealDB connected`, {
    url: connectionConfig.url,
    namespace: connectionConfig.ns,
    database: connectionConfig.db,
  });

  return client;
}

async function closeClient(client) {
  if (!client) return;
  if (typeof client.close === 'function') {
    await client.close();
  }
}

module.exports = {
  createConnectedClient,
  closeClient,
};
