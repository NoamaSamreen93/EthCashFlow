const express  = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const Web3 = require('web3'); 
const provider = 'https://mainnet.infura.io/v3/413b6fff767a47178527bacc84ff96d2'; //Your Infura Endpoint
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
const port = 3000;

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var range={}
var blocks =[]
var senders=[]
var receivers=[]
var transactionHashes=[]
var transactionObjects=[]
var contractCreated=0;
var totalEtherTransferred=0;
var contractCodes=[]
var latestBlockNumber=0;
var contracts=0;

async function queryBlock(i){
	var json =  await web3.eth.getBlock(i);
	return json;
}
async function queryTransaction(i){
	var json = await web3.eth.getTransaction(i);
	return json;
}
async function queryContractCode(i){
	var code = await web3.eth.getCode(i);
	return code;
}
app.get("/", async function(req, res){
latestBlockNumber = await web3.eth.getBlockNumber();
console.log("Latest Block Number: "+ latestBlockNumber);
res.render("index", {latestBlockNumber});
});

app.post("/blockrange", async (req, res) => {
	var fromBlock = req.body.fromBlock;
	var toBlock = req.body.toBlock;
	range = {fromBlock:fromBlock, toBlock:toBlock}
	getData(range, res);
});

app.post("/blocksFromLatest", async (req, res) => {
	var numBlocksFromLatest = req.body.numBlocksFromLatest;
	var fromBlock = latestBlockNumber - numBlocksFromLatest;
	var toBlock = latestBlockNumber;
	range = {fromBlock:fromBlock, toBlock:toBlock}
	getData(range, res);
});
	

function getData(range, res){
	for (var i = range.fromBlock; i <=range.toBlock; i++)
		blocks.push(queryBlock(i));
	
	Promise.all(blocks).then((blocklist)=>{
		for(var i=0; i < blocklist.length; i++){
			//console.log("Block List Length: " + blocklist.length);
			for(var j =0; j < blocklist[i].transactions.length; j++){
			transactionHashes.push(blocklist[i].transactions[j]);
			}
		}
		
	for(var i=0; i<transactionHashes.length;i++)
		transactionObjects.push(queryTransaction(transactionHashes[i]));
	Promise.all(transactionObjects).then((transactionlist)=>{
		//console.log("Transaction List Length: " + transactionlist.length);
		for(var i=0; i < transactionlist.length; i++){
			var fromAddress = transactionlist[i].from;
			var toAddress = transactionlist[i].to;
			var ether = parseFloat(web3.utils.fromWei(web3.utils.toBN(transactionlist[i].value)));
			totalEtherTransferred+=ether;
			var sender={
			"address": fromAddress,
			"type": "",
			"ethSent": ether,
			"code":""
			}
			if (toAddress === null || toAddress==="" ||toAddress===undefined){ //check contract creation transactions
				//console.log("----ToAddress: "+ toAddress+ "-----");
				contractCreated++;
				continue;
			}
			var senderIndex = senders.findIndex(object=> object.address ==sender.address);  //find unique senders
			if(senderIndex == -1){
				senders.push(sender);
			}
			else {
			senders[senderIndex].ethSent+=sender.ethSent;									//add ether sent to the previous ether sent value to get a total of ether value sent by an address
			}	
			var receiver={
			"address": toAddress,
			"type": "",
			"ethReceived": ether,
			"code":""
			}
			var receiverIndex = receivers.findIndex(object=> object.address ==receiver.address);  //find unique receivers
			if(receiverIndex == -1){
				receivers.push(receiver);
			}
			else{
			receivers[receiverIndex].ethReceived+=receiver.ethReceived;				//add ether received to the previous ether received value to get a total of ether value received by an address
			}
		}
		for (var i=0;i<receivers.length;i++)
			contractCodes.push(queryContractCode(receivers[i].address));
		for (var i=0;i<senders.length;i++)
			contractCodes.push(queryContractCode(senders[i].address));
		Promise.all(contractCodes).then((contractCodelist)=>{
			for(var i=0; i < receivers.length; i++){
				if(contractCodelist[i]=="0x" || contractCodelist[i]=="0x0" )		//check the type of address 0x- Externally owned account (EOA) or contract 
					receivers[i].type="EOA";
				else{
					receivers[i].type="Contract";
					contracts++;
				}
			}
			for(var j=0; j < senders.length; j++){
				if(contractCodelist[j]=="0x" || contractCodelist[j]=="0x0" )
					senders[j].type="EOA";
				else{
					senders[j].type="Contract";
					contracts++;
				}
			}
			var contractPercent = parseFloat((contracts/transactionHashes.length)*100).toFixed(2);
			res.render("ethcashflow",{'range':range, 'senders' : senders, 'receivers': receivers, contractCreated, totalEtherTransferred, contractPercent});  //load the report page with transactions data
			});
		});
	});
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');