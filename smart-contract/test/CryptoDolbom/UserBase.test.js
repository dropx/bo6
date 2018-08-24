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
  describe('signUp', async function () {

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
    });
  });
  describe('processKyc', async function () {
    context('when user is signed up', async function () {
      beforeEach(async function () {
        const userName = 'Joe Cool';
        const birthYear = 1999;
        const gender = Gender.M;
        await this.userBase.signUp(userName, birthYear, gender, { from: nonOwner }).should.be.fulfilled;
      });
      it('processes KYC', async function () {
        const userAddress = nonOwner; 
        const kycHash = 0x29423;
        const fullNameHash = 0x3293; 
        
        await this.userBase.processKyc( userAddress, kycHash, fullNameHash).should.be.fulfilled;
        const userId = await this.userBase.addressToUserId( userAddress);
        const user = await this.userBase.users(userId);
        user[3].should.be.bignumber.equal(kycHash);
        user[4].should.be.bignumber.equal(fullNameHash);
        const testUserAddress = await this.userBase.kycHashToAddress(kycHash);
        testUserAddress.should.be.equal(userAddress);
      })
      context('when user is finish KYC', async function () {
        const userAddress = nonOwner;
        beforeEach(async function () {
          const kycHash = 0x29423;
          const fullNameHash = 0x3293; 

          await this.userBase.processKyc( userAddress, kycHash, fullNameHash)
        });
  
  
        it('reverts when already finish KYC', async function () {
          const kycHash = 0x29423;
          const fullNameHash = 0x3293; 

          await this.userBase.processKyc( userAddress, kycHash, fullNameHash).should.be.rejectedWith(/revert/);
          await this.userBase.processKyc( owner, kycHash, fullNameHash).should.be.rejectedWith(/revert/);
          await this.userBase.processKyc( anotherNonOwner, kycHash, fullNameHash).should.be.rejectedWith(/revert/);

        });
      });
    });
  });
  describe('updateUserName', async function () {
    context('when user is signed up', async function () {
      beforeEach(async function () {
        const userName = 'Joe Cool';
        const birthYear = 1999;
        const gender = Gender.M;
        await this.userBase.signUp(userName, birthYear, gender, { from: nonOwner }).should.be.fulfilled;
      });
      it('update username', async function () {
        const userAddress = nonOwner; 
        const newUserName = 'dropx'

        const userId = await this.userBase.addressToUserId( userAddress);

        await this.userBase.updateUserName( userId, newUserName);
        const user = await this.userBase.users(userId);
        user[0].should.be.equal(newUserName);

      });
    });
  });
});
