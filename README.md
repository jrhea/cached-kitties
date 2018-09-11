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
***tests***
```bash
$ npm test
```
or
```bash
$ sh scripts/run-tests.sh 8080
```
## Swagger Documentation

When you run the server (dev or prod), it will automatically create and publish the latest swagger documentation here:

```
http://localhost:8080/swagger
```

![cached-kitties](https://raw.githubusercontent.com/jrhea/cached-kitties/master/docs/endpoints.jpeg)
