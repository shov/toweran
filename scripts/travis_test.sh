#!/usr/bin/env bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

#Test the package itself
cd "${SCRIPT_PATH}/.."
TOWERAN_PACKAGE_TEST=0
npm test \
    && TOWERAN_PACKAGE_TEST=1

if [[ ${TOWERAN_PACKAGE_TEST} < 1 ]]; then
    echo "Toweran package tests were failed"
    exit 1
fi;

#Test the boilerplate
cd "${SCRIPT_PATH}/.."
TOWERAN_BOILERPLATE_TEST=0

mkdir test_project \
    && cd test_project \
    && npm init -y \
    && node ${SCRIPT_PATH}/toweran.js create-project . --travis-fixtures \
    && npm i \
    && npm test \
    && TOWERAN_BOILERPLATE_TEST=1

if [[ ${TOWERAN_BOILERPLATE_TEST} < 1 ]]; then
    echo "Toweran boilerplate tests were failed"
    exit 2
fi;

