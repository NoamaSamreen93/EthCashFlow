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
	
});


/* Work in Progress */