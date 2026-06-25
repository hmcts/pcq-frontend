#!/bin/bash
set -ex

# Setup required environment variables. TEST_URL should be set by CNP
export E2E_FRONTEND_URL=${TEST_URL}

EXIT_STATUS=0
BROWSER_GROUP=chromium yarn test-crossbrowser-e2e:playwright || EXIT_STATUS=$?
BROWSER_GROUP=firefox yarn test-crossbrowser-e2e:playwright || EXIT_STATUS=$?
BROWSER_GROUP=webkit yarn test-crossbrowser-e2e:playwright || EXIT_STATUS=$?

echo EXIT_STATUS: $EXIT_STATUS
exit $EXIT_STATUS
