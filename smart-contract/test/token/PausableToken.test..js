const PausableToken = artifacts.require('PausableTokenMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const bo6 = n => new BigNumber(web3.toWei(n, 'ether')); // n BO6 = n * 10^18 BO6wei

contract('PausableToken', function (accounts) {
  const [owner, nonOwner, anotherNonOwner] = accounts;
  const initialTokenBalance = bo6(29);
  const transferTokenAmount = bo6(11);

  beforeEach(async function () {
    this.token = await PausableToken.new();
    await this.token.mockMintToken(owner, initialTokenBalance);
    await this.token.mockMintToken(nonOwner, initialTokenBalance);
    await this.token.mockMintToken(anotherNonOwner, initialTokenBalance);
  });

  describe('token transfer', async function () {
    const [sender, reciever] = accounts;

    context('when unpaused', async function () {
      it('transfer tokens', async function () {
        await this.token.transfer(reciever, transferTokenAmount, { from: sender }).should.be.fulfilled;
        const senderBalance = await this.token.balanceOf(sender);
        senderBalance.should.be.bignumber.equal(initialTokenBalance.minus(transferTokenAmount));

        const recieverBalance = await this.token.balanceOf(reciever);
        recieverBalance.should.be.bignumber.equal(initialTokenBalance.plus(transferTokenAmount));
      });
    });


    context('when paused', async function () {
      beforeEach(async function () {
        await this.token.pause();
      });

      it('can not transfer tokens and reverts', async function () {
        await this.token.transfer(reciever, transferTokenAmount, { from: sender }).should.be.rejectedWith(/revert/);
        await this.token.transfer(sender, transferTokenAmount, { from: reciever }).should.be.rejectedWith(/revert/);
      });
    });
  });

  describe('token approval', async function () {
    const [approver, spender] = accounts;
    const requestTokenAmount = transferTokenAmount;

    context('when unpaused', async function () {
      it(`approves the requested amount to spender`, async function () {
        await this.token.approve(spender, requestTokenAmount, { from: approver }).should.be.fulfilled;
        const allowance = await this.token.allowance(approver, spender);
        allowance.should.bignumber.be.equal(requestTokenAmount);
      });
    });

    context('when paused', async function () {
      beforeEach(async function () {
        await this.token.pause();
      });

      it(`can not approve the requested amount to spender`, async function () {
        await this.token.approve(spender, requestTokenAmount, { from: approver }).should.be.rejectedWith(/revert/);
        const allowance = await this.token.allowance(approver, spender)
        allowance.should.bignumber.be.equal(0);
      });
    });
  });

  describe('token transfer from approver', async function () {
    const [approver, spender, other] = accounts;
    const requestTokenAmount = transferTokenAmount;

    beforeEach(async function () {
      await this.token.approve(spender, requestTokenAmount, { from: approver });
    });

    context('when unpaused', async function () {
      it(`transfers the requested amount from approver`, async function () {
        await this.token.transferFrom(approver, other, requestTokenAmount, { from: spender }).should.be.fulfilled;
        const approverBalance = await this.token.balanceOf(approver);
        approverBalance.should.be.bignumber.equal(initialTokenBalance.minus(transferTokenAmount));

        const otherBalance = await this.token.balanceOf(other);
        otherBalance.should.be.bignumber.equal(initialTokenBalance.plus(transferTokenAmount));
      });
    });

    context('when paused', async function () {
      beforeEach(async function () {
        await this.token.pause();
      });

      it(`can not transfer the requested amount from approver`, async function () {
        await this.token.transferFrom(approver, other, requestTokenAmount, { from: spender }).should.be.rejectedWith(/revert/);
      });
    });
  });

});
