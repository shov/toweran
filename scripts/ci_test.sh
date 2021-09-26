#!/usr/bin/env bash

SCRIPT_PATH="$(
  cd "$(dirname "$0")" || exit 3
  pwd -P
)"

#Clean up
cleanUp() {
  cd "${SCRIPT_PATH}/.." || exit 3
  rm -Rf test_project
  echo "Cleanup finished ✨🧹"
}

#Test the package itself
cd "${SCRIPT_PATH}/.." || exit 3
TOWERAN_PACKAGE_TEST=0
npm test &&
  TOWERAN_PACKAGE_TEST=1

if [[ ${TOWERAN_PACKAGE_TEST} -lt 1 ]]; then
  echo "Toweran package tests were failed"
  cleanUp
  exit 1
fi

#Test the boilerplate
testBoilerlateWithOpts() {
  cd "${SCRIPT_PATH}/.." || exit 3
  local TOWERAN_BOILERPLATE_TEST=0

  mkdir test_project &&
    cd test_project &&
    npm init -y &&
    node "${SCRIPT_PATH}/toweran.js" create-project . $@ &&
    npm i &&
    npm test &&
    TOWERAN_BOILERPLATE_TEST=1

  if [[ ${TOWERAN_BOILERPLATE_TEST} -lt 1 ]]; then
    echo "Toweran boilerplate tests were failed"
    cleanUp
    exit 2
  fi

  cleanUp
}

echo "CI fixtures regular test:"
testBoilerlateWithOpts "--ci-fixtures"

echo "CI fixtures, skip .env"
testBoilerlateWithOpts "--ci-fixtures" "--skip-env"
