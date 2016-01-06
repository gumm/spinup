#!/bin/bash

WORKSPACE=$1
BUILD_PATH=$2
LIB_PATH=$3
PROJECT_NAME=$4
PARTS_PATH=${BUILD_PATH}/parts

echo "-------------------------------------------------------------------------"

command -v wget >/dev/null 2>&1 || { echo >&2 "I require wget but it's not installed.  Aborting."; exit 1; }
command -v figlet >/dev/null 2>&1 || { echo >&2 "I require figlet but it's not installed.  Aborting."; exit 1; }

figlet JS Environment

echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "-------------------------------------------------------------------------"
echo ""

${PARTS_PATH}/get_linter.sh ${WORKSPACE} ${PROJECT_NAME}

#npm install google-closure-library --save
#npm install google-closure-compiler --save
#npm install bad-library --save
#npm install crypto --save
#npm install express-session --save
#npm install kerberos --save
#npm install less --save
#npm install less-middleware --save
#npm install less-plugin-clean-css --save
#npm install mongodb --save



