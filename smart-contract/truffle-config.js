require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity\/test\/helpers)/
});
require('babel-polyfill');

// to set envrionment variables, use the `.env` file in the same path as this file.
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = process.env.MNEMONIC;
const infuraKey = process.env.INFURA_API_KEY;
const useSolidityCoverage = process.env.SOLIDITY_COVERAGE;
const useGasReporter = process.env.GAS_REPORTER;

if (!mnemonic) throw Error('Error: Environment variable `MNEMONIC` is not set');

const getProvider = (
  providerUrl,
  addressIndex = 0,
  numAddresses = 5
) => !useSolidityCoverage
    ? () => new HDWalletProvider(mnemonic, providerUrl, addressIndex, numAddresses)
    : console.log('use solcover') && undefined; // https://github.com/sc-forks/solidity-coverage/blob/master/docs/faq.md#using-alongside-hdwalletprovider

const devProvider = getProvider('http://localhost:8545');
const testnetProvider = getProvider(`https://ropsten.infura.io/${infuraKey}`);

const mocha = useGasReporter
  ? {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'KRW',
      gasPrice: 5,
    },
  }
  : undefined;

module.exports = {
  networks: {
    coverage: {
      host: 'localhost',
      port: 8555,
      network_id: '*', // eslint-disable-line camelcase
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    rpc: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
    development: {
      host: 'localhost',
      port: 8545,
      provider: devProvider,
      gas: 90000000000,
      gasPrice: 1,
      network_id: '*', // eslint-disable-line camelcase
    },
    ropsten: {
      provider: testnetProvider,
      network_id: 3, // eslint-disable-line camelcase
      gas: 4600000,
    },
  },
  mocha,
};
