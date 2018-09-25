const config = require('config');

module.exports = () => {
  if (
    !config.get('dbHost') ||
    !config.get('dbUser') ||
    !config.get('dbPass') ||
    !config.get('dbName')
  ) {
    throw new Error(
      'FATAL ERROR: Database connection parameters are not defined.'
    );
  }
};
