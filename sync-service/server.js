'use strict';

require('dotenv').config();

const express = require('express');
const { loadConfig } = require('./src/config');
const { createLogger } = require('./src/logger');
const { SyncManager } = require('./src/sync-manager');

async function main() {
  const config = loadConfig(process.env);
  const logger = createLogger(config.logLevel);
  const manager = new SyncManager(config, logger);

  const app = express();
  app.get('/health', (req, res) => {
    const stats = manager.getStats();
    res.status(stats.healthy ? 200 : 503).json({
      ok: stats.healthy,
      service: 'posr-sync-service',
      stats,
    });
  });

  app.get('/stats', (req, res) => {
    res.json(manager.getStats());
  });

  await manager.start();

  const server = app.listen(config.servicePort, config.serviceHost, () => {
    logger.info(`Sync service listening on http://${config.serviceHost}:${config.servicePort}`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down sync service`);
    await manager.stop();
    await new Promise((resolve) => server.close(resolve));
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start sync service', error);
  process.exit(1);
});
