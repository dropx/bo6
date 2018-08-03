import expectEvent from 'openzeppelin-solidity/test/helpers/expectEvent';
import chai from 'chai';

const Sample = artifacts.require('Sample');
const BigNumber = web3.BigNumber;

chai.use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('Sample', function (accounts) {
  const [owner] = accounts;

  beforeEach(async function () {
    this.sample = await Sample.new()
  });

  it('sets description', async function () {
    const SMAPLE_CONTRACT_DESC = 'this is a sample contract';
    expectEvent.inTransaction(await this.sample.setDesc(SMAPLE_CONTRACT_DESC), 'DescChanged');
    this.sample.desc().should.eventually.be.equal(SMAPLE_CONTRACT_DESC);
  });
});
