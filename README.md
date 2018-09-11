# Cached-Kitties API
A Crypto Kitty read cache API service

![cached-kitties](https://raw.githubusercontent.com/jrhea/cached-kitties/master/docs/cached-kitties.gif)

## Installation

```bash
$ brew install redis
$ cd src && npm install
```
## How to run

***development:***
```bash
$ npm run dev
```
or
```bash
$ sh scripts/run-dev.sh 8080
```
***production:***
```bash
$ npm run prod
```
or
```bash
$ PORT=8080 REDIS_URL=127.0.0.1 node ./server.js
```

## Unit Tests

```bash
$ npm test

> cached-kitties@1.0.0 test /Users/jrhea1980/Documents/projects/consensys/cached-kitties/src
> sh scripts/run-tests.sh 8080

Listening on :::8080
  /GET :network/kitties/:id/:block
    ✓ Should return a valid response object with genes: "457849305451122794903585758459448676010482976302081674570064376741933484". (60ms)

  /GET :network/kitties/:id
    ✓ Should return a valid response object with genes: "457849305451122794903585758459448676010482976302081674570064376741933484" (763ms)

  /GET /:network/getKittiesSoldByBlock/:fromBlock/:toBlock
    ✓ Should return a valid response array of length 1 and returnValue.winner:"0xFAC9991178a0dE67dAa90c104AD4e722BAbea035"

  /GET :network/view_getTransactionsByHash
    ✓ Should return a valid response and the result should be an array of length 80.

  /GET :network/view_getTransactionsByHashAndAddress
    ✓ Should return a valid response and the result should be an array of length 26

  /GET /:network/:method
    ✓ Should return a valid response containing the block and it should contain transactions

  6 passing (863ms)
```

## Swagger Documentation

When you run the server (dev or prod), it will automatically create and publish the latest swagger documentation here:

```
http://localhost:8080/swagger
```

![cached-kitties](https://raw.githubusercontent.com/jrhea/cached-kitties/master/docs/endpoints.jpeg)
