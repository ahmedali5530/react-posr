'use strict';

const express = require('express');
const { handleWebhook } = require('../controllers/webhooks.controller');

const router = express.Router();

router.post('/:gateway', handleWebhook);

module.exports = router;
