#!/bin/bash
set -ex

NODE_ENV=testing ALLOW_CONFIG_MUTATIONS=true yarn codeceptjs run -c ./test/end-to-end/codecept.conf.js
