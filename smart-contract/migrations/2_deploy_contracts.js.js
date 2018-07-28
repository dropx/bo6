const Sample = artifacts.require("Sample.sol");

module.exports = function(deployer) {
  return deployer.deploy(Sample);
};
