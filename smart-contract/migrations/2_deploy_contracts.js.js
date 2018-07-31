const Sample = artifacts.require("Sample.sol");
const BO6Token = artifacts.require('BO6Token.sol');

module.exports = function (deployer, network, accounts) {
  return deployer
    .then(() => {
      return deployer.deploy(Sample);
    })
    .then(() => {
      return deployer.deploy(BO6Token);
    })
    .catch(error => console.error({ error }));
};
