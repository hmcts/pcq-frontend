#!/bin/bash
set -ex

yarn install
NODE_PATH=. node setup/copyGovukResources.js
NODE_PATH=. yarn sass
NODE_PATH=. yarn createVersionFile
NODE_PATH=. yarn sass-ie8
NODE_PATH=. yarn bundle
