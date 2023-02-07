#!/bin/bash
set -ex

NODE_ENV=testing NODE_PATH=. yarn codeceptjs run -c ./test/end-to-end/smoke.conf.js
