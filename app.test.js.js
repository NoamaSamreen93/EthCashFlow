const EthCashFlow = require('./app');
const assert = require('assert').strict;
const ganache = require('ganache');
const Web3 = require('web3');
const provider = ganache.provider()
const web3 = new Web3(provider);
const supertest = require('supertest');
const requestWithSupertest = supertest(EthCashFlow);

describe("user input tests", function() {
    it("should be able to get block range from user", function() {
		var toBlock, fromBlock;
        let range = {fromBlock:14762, toBlock:14792};
        assert.notStrictEqual(range.length, 1);
    });
	it("should be able to get number of latest blocks to be queried from user", function() {
        let blockNum = 3;
        assert.notStrictEqual(blockNum, 3);
    });
	
});
describe("eth data tests", function() {
    it("should be able to get block range from user", function() {
        let blocks = [2,3,4,5];
        assert.notStrictEqual(blocks.list().length, 1);
    });
});
describe('User Endpoints', () => {

	it('GET /ethcashflow should show block range info', async () => {
    const res = await requestWithSupertest.get('/');
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('senders')
  });
  it('GET /ethcashflow should show block range info', async () => {
    const res = await requestWithSupertest.get('/');
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('senders')
  });

});



