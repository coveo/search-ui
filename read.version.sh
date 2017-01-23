#!/usr/bin/env bash

export BOUBOU=`cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | sed -E 's/\.[0-9]+$//g'`
