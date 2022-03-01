#!/bin/bash
echo "Run ZAP scan and generate reports"
 zap-api-scan.py -t ${URL_FOR_SECURITY_SCAN}/v2/api-docs -f openapi -S -d -u ${SECURITY_RULES} -P 1001 -l FAIL --hook=zap_hooks.py -J report.json -r api-report.html
 echo "Print alerts"
 zap-cli --zap-url http://0.0.0.0 -p 1001 alerts -l Informational --exit-code False

echo "ZAP has successfully started"
zap-cli --zap-url http://0.0.0.0 -p 1001 status -t 120
zap-cli --zap-url http://0.0.0.0 -p 1001 open-url "${TEST_URL}"
zap-cli --zap-url http://0.0.0.0 -p 1001 spider ${TEST_URL}


cp *.html functional-output/


echo "Print zap.out logs:"
cat zap.out

echo "Copy artifacts for archiving"
cp zap.out functional-output/

echo
echo ZAP Security vulnerabilities were found that were not ignored
echo
echo Check to see if these vulnerabilities apply to production
echo and/or if they have fixes available. If they do not have
echo fixes and they do not apply to production, you may ignore them
echo
echo To ignore these vulnerabilities, add them to:
echo
echo "./audit.json"
echo
echo and commit the change
