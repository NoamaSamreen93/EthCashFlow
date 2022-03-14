# Eth-Cash-Flow Tool 
A block explorer which lets a user access ad-hoc blockchain data. This tool takes either a range of blocks input denoted by "From Block" and "To Block" from the user or a simple number of blocks that denotes the latest blocks added to the mainnet. It then queries Ethereum mainnet to report on total Ether transacted in the given block range. Currently, it supports reporting on the following information for a given block range- 
* Total Ether transferred/received
* Number of Unique sender addresses and the total ether sent by them
* Number of Unique receiver addresses and the total ether received by them
* Number of transactions that create a contract
* Percent of contract transactions

# Building the Tool 
This is a Node.js project written using Express. EJS was used as the view engine.
```
npm build
```
# Test the Tool
Uses mocha.
```
npm test
```
# Run the Tool
```
npm start
```

