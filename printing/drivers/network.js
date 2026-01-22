'use strict';

const Network = require('escpos-network');

/**
 * Network printer driver using escpos-network adapter.
 * @param {Object} config - { ip: string, port?: number }
 * @returns {Object} escpos Network adapter (device) with open, write, close
 */
function createDevice(config = {}) {
  const { ip, port = 9100 } = config;
  if (!ip) {
    throw new Error('Network printer requires "ip" in config');
  }
  return new Network(ip, port);
}

module.exports = { createDevice };
