#!/bin/bash
set -ex

NODE_PATH=. node setup/copyGovukResources.js
NODE_PATH=. npm rebuild node-sass
NODE_PATH=. npm run sass
NODE_PATH=. npm run createVersionFile
NODE_PATH=. npm run sass-ie8
NODE_PATH=. npm run bundle
