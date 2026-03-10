'use strict';

function sendSuccess(res, data, status = 200) {
  res.status(status).json({
    success: true,
    data,
  });
}

function sendError(res, status, message, details) {
  res.status(status).json({
    success: false,
    error: message,
    details: details || undefined,
  });
}

function handleError(res, err) {
  const message = err && err.message ? err.message : 'Unexpected server error';
  if (message.toLowerCase().includes('unsupported')) {
    return sendError(res, 400, message);
  }
  if (message.toLowerCase().includes('required')) {
    return sendError(res, 422, message);
  }
  return sendError(res, 500, 'Payment service request failed');
}

module.exports = {
  sendSuccess,
  sendError,
  handleError,
};
