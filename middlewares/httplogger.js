const morgan = require('morgan');
const { logger } = require('../logger');

logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = morgan(
  '"Method"= :method "API URL"= :url "Status Code"= :status "Response Time"= :response-time ms - :res[content-length]',
  { stream: logger.stream }
);
