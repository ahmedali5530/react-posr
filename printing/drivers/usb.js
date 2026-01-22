'use strict';

const USB = require('escpos-usb');

/**
 * USB printer driver using escpos-usb adapter.
 * @param {Object} config - { vid?: number, pid?: number }
 * @returns {Object} escpos USB adapter (device) with open, write, close
 */
function createDevice(config = {}) {
  const { vid, pid } = config;
  if (vid != null && pid != null) {
    return new USB(vid, pid);
  }
  return new USB();
}

module.exports = { createDevice };
