#!/bin/bash

trap 'pgrep redis-server |xargs kill' EXIT;
redis-server > /dev/null &
node server.js
