'use strict';

class BaseGateway {
  constructor(name) {
    this.name = name;
  }

  async createIntent(_payload) {
    throw new Error(`createIntent is not implemented for ${this.name}`);
  }

  async verify(_payload) {
    throw new Error(`verify is not implemented for ${this.name}`);
  }

  async handleWebhook(_payload) {
    throw new Error(`handleWebhook is not implemented for ${this.name}`);
  }
}

module.exports = { BaseGateway };
