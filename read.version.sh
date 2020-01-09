#!/usr/bin/env bash

export PACKAGE_JSON_VERSION=`cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | sed -E 's/\.[0-9]+$//g' | xargs`
export PACKAGE_PATCH_VERSION=`cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | sed -E 's/[0-9]\.[0-9]+\.//g' | xargs`