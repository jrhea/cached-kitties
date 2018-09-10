#!/bin/bash

trap 'pgrep redis-server |xargs kill' EXIT;
redis-server > /dev/null &
PORT=8080 REDIS_URL=127.0.0.1 mocha --exit --timeout 1000

