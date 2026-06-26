#!/bin/bash
set -ex

# Setup required for cross-browser tests. TEST_URL should be set by CNP
export E2E_FRONTEND_URL=${TEST_URL}
export IGNORE_SESSION_VALIDATION=true

yarn test:crossbrowser
