'use strict';

require('dotenv').config();

const express = require('express');
const { loadConfig } = require('./src/config');
const { createLogger } = require('./src/logger');
const { SyncManager } = require('./src/sync-manager');

async function main() {
  const config = loadConfig(process.env);
  const logger = createLogger(config.logLevel);
  const manager = config.syncEnabled ? new SyncManager(config, logger) : null;

  const app = express();
  app.get('/health', (req, res) => {
    if (!manager) {
      res.status(200).json({
        ok: true,
        enabled: false,
        service: 'posr-sync-service',
        message: 'Sync service is disabled because SYNC_MASTER_URL is not configured.',
      });
      return;
    }

    const stats = manager.getStats();
    res.status(stats.healthy ? 200 : 503).json({
      ok: stats.healthy,
      enabled: true,
      service: 'posr-sync-service',
      stats,
    });
  });

  app.get('/stats', (req, res) => {
    if (!manager) {
      res.json({
        enabled: false,
        message: 'Sync service is disabled because SYNC_MASTER_URL is not configured.',
      });
      return;
    }

    res.json({
      enabled: true,
      ...manager.getStats(),
    });
  });

  if (manager) {
    await manager.start();
  } else {
    logger.warn('SYNC_MASTER_URL is missing; sync manager startup skipped and service is disabled.');
  }

  const server = app.listen(config.servicePort, config.serviceHost, () => {
    logger.info(`Sync service listening on http://${config.serviceHost}:${config.servicePort}`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down sync service`);
    if (manager) {
      await manager.stop();
    }
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
