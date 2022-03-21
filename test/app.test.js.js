/*
Ether Cash Flow Server - Test
Author - Noama Samreen 

This js is used to test the Ether Cash Flow Server.
*/
const { assert, expect } = require("chai");
let chai = require ("chai");
let chaiHttp = require("chai-http");
let server = require('../app');
const ganache = require('ganache');
/*const Web3 = require('web3');
const res = require("express/lib/response");
const provider = ganache.provider()
const web3 = new Web3(provider);
*/
const Web3 = require('web3'); 
const provider = 'https://mainnet.infura.io/v3/413b6fff767a47178527bacc84ff96d2'; //Your Infura Endpoint
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);

//Assertion 
chai.should();
chai.use(chaiHttp);
describe ('EthCashFlowAPI', () => {

    /** 
     * Test the GET route by block range
     */
    

    describe ("Get /", async () => {
        it("It should GET the index page with latest block number", (done) => {
            chai.request(server)
            .get ("/")
            .end((err, res)=> {
                res.should.have.status(200);
            done();
            })
        })
    })

    describe ("Post /", () => {
        it("It should POST the block range", (done) => {
            const range = {
                fromBlock: 2000,
                toBlock:2001
            }
            chai.request(server)
            .post ("/blockrange")
            .send(range)
            .end((err, res)=> {
                res.should.have.status(200)
                assert.notStrictEqual(range.length, 1);
            done();
            })
        })

        it("It should POST the number of blocks from latest block", (done) => {
            const n = "2";
            chai.request(server)
            .post ("/blocksFromLatest")
            .send(n)
            .end((err, res)=> {
                res.should.have.status(200)
                assert.notStrictEqual(n, 2);
            done();
            })
        })
    })  

    //query to get block data by number
    async function queryBlock(i){  		
        try{
            var json =  await web3.eth.getBlock(i);
        }
        catch(e){
            console.error(e);
        }
        return json;
    }
    //query to get transaction by transaction hash
    async function queryTransaction(i){
        try{
            var json = await web3.eth.getTransaction(i);
        }
        catch(e){
            console.error(e);
        }
        return json;
    }
    //query to get contract code from an address
    async function queryContractCode(i){
        try{
            var code = await web3.eth.getCode(i);
        }
        catch(e){
            console.error(e);
        }
        return code;
    }  
      
    describe('Query Block', () => {
        it('resolves with block object', () => {
            return queryBlock(10000).then(result => {
              //console.log(result);
            assert.notEqual(result,'undefined');
            assert.isObject(result);
          })
        })
        it('it has transactions array in the block object', () => {
            return queryBlock(10000).then(result => {
            expect(result).to.have.property('transactions');
            assert.isArray(result.transactions);
            })
        })
    })
    describe('Query Transaction', () => {
        it('resolves with transaction object', () => {
          return queryTransaction("0x15142f3038a271ac9ec7b3933089cefd5ac3cd88309dfb565dc895e822f9a52a").then(result => {
            assert.notEqual(result,'undefined');
            assert.isObject(result);
          })
        })
        it('it has transactions array in the block object', () => {
            return queryTransaction("0x15142f3038a271ac9ec7b3933089cefd5ac3cd88309dfb565dc895e822f9a52a").then(result => {
            expect(result).to.have.property('to');
            assert.isString(result.to);
            assert.isString(result.from);
            assert.isString(result.value)
            })
        })
    })

    describe('Query Contract Code', () => {
        it('resolves with contract code', () => {
          return queryContractCode("0x3b8aaeeef166a50a596eb086b9e81f4070b0be4c").then(result => {
            assert.notEqual(result,'undefined');
            assert.isString(result);
          })
        })
    }) 
})
