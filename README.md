# Cached-Kitties API

## Installation

brew install redis

cd src && npm install

## How to run

***development:***
```bash
$ npm run dev
```

***production:***
```bash
$ npm run start
```

## Examples
```
http://localhost:8080/api/v1/infura/ropsten/eth_gasPrice
http://localhost:8080/api/v1/infura/mainnet/eth_getBlockByHash?params=[%220xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35%22,false]
http://localhost:8080/api/v1/infura/mainnet/eth_getBlockTransactionCountByHash?params=[%220xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35%22]
http://localhost:8080/api/v1/infura/mainnet/eth_getTransactionByBlockHashAndIndex?params=[%220xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35%22,%220x0%22]
http://localhost:8080/api/v1/infura/mainnet/view_getTransactionsByHash?params=[%220xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35%22]
```

## Swagger Documentation

When you run the server (dev or prod), it will automatically create and publish the latest swagger documentation here:

```
http://localhost:8080/swagger
```