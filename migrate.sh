#!/bin/bash

yarn run ts-node ./node_modules/typeorm/cli.js migration:generate -d ormconfig.ts src/migrations/$1