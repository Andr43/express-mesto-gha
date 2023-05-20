const {
  HTTP_STATUS_FORBIDDEN,
} = require('../utils/constants');

class StatusForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = StatusForbiddenError;
