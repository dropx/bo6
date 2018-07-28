const path = require('path');
const configTruffle = require('@bo6/shared/configTruffle');
const dotEnvPath = path.resolve(__dirname, './.env');

module.exports = configTruffle(dotEnvPath);
