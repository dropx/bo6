const UserBase = artifacts.require('UserBase');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('UserBase', function (accounts) {
  const [owner, nonOwner, anotherNonOwner] = accounts;
  const Gender = {
    M: 0,
    F: 1,
  }


  beforeEach(async function () {
    this.userBase = await UserBase.new();
  })

  it('signs up', async function () {
    const userName = 'Joe Cool';
    const birthYear = 1999;
    const gender = Gender.M;
    const userId = 0;
    await this.userBase.signUp(userName, birthYear, gender, { from: nonOwner }).should.be.fulfilled;
    const newUser = await this.userBase.users(userId);
    newUser[0].should.be.equal(userName);
    newUser[1].should.be.bignumber.equal(birthYear);
    newUser[2].should.be.bignumber.equal(gender);
    newUser[3].should.be.bignumber.equal(0);
    newUser[4].should.be.bignumber.equal(0);

    const newUserAddress = await this.userBase.userIdToAddress(userId);
    newUserAddress.should.be.equal(nonOwner);

    const newUserId = await this.userBase.addressToUserId(nonOwner);
    newUserId.should.be.bignumber.equal(userId);
  });

  context('when user is signed up', async function () {
    beforeEach(async function () {
      const userName = 'Joe Cool';
      const birthYear = 1999;
      const gender = Gender.M;
      await this.userBase.signUp(userName, birthYear, gender, { from: nonOwner }).should.be.fulfilled;
      await this.userBase.signUp(userName, birthYear, gender, { from: owner }).should.be.fulfilled;
    });


    it('reverts when already signed up', async function () {
      const userName = 'Joe Cool';
      const birthYear = 1999;
      const gender = Gender.M;
      await this.userBase.signUp(userName, birthYear, gender, { from: nonOwner }).should.be.rejectedWith(/revert/);
      await this.userBase.signUp(userName, birthYear, gender, { from: owner }).should.be.rejectedWith(/revert/);
    });
  })



})
