#!/bin/bash

LINT_TARGET=$1
BASE_NAME=$(basename "${LINT_TARGET}")


echo "-----------------------------------------------------"

figlet Lint ${LINT_TARGET}

echo "JS_PATH: ${JS_PATH}"
echo "LINT_TARGET: ${LINT_TARGET}"
echo "-----------------------------------------------------"
echo ""
echo "Now formatting with Clang..."
shopt -s globstar
~/.local/lib/clang/bin/clang-format -i -style=Google ${LINT_TARGET}/**/*.js

echo "Finished"
