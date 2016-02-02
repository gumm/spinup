#!/bin/bash

# ---------------------------------------------------------------[ Variables ]--
# Passed in
WORKSPACE=$1
BUILD_JOB=$2
BUILD_PARM=$3

# Derived
BUILD_PATH=${WORKSPACE}/bin/build
BUILD_LOG_PATH=${BUILD_PATH}/log
BUILD_LOG_FILE=${BUILD_LOG_PATH}/last_compile.log
NODE_ROOT=${WORKSPACE}/www
NODE_MODULES=${WORKSPACE}/node_modules
PUBLIC_PATH=${WORKSPACE}/public
JS_PATH=${PUBLIC_PATH}/js
LINKED_LIBS_PATH=${PUBLIC_PATH}/js/linked-libs
CSS_PATH=${PUBLIC_PATH}/css
COMPILED_OUTPUT_PATH=${PUBLIC_PATH}/compiled
CLOSURE_COMPILER_PATH=${NODE_MODULES}/google-closure-compiler
LESS_COMPILER=${NODE_MODULES}/less/bin/lessc

# Read in from package.json file
PROJECT_NAME=`grep name ${WORKSPACE}/package.json | cut -f4 -d'"'`
SITE_VERSION=`grep version ${WORKSPACE}/package.json | cut -f4 -d'"'`

# --------------------------------------------------------[ Output Locations ]--
# Make sure the logfile is available.
# This is create here in the build directory
mkdir -p ${BUILD_LOG_PATH}
touch ${BUILD_LOG_FILE}

# Make sure the compiled output directory exists
mkdir -p ${COMPILED_OUTPUT_PATH}

# Make sure the linked library paths exists
mkdir -p ${LINKED_LIBS_PATH}

# Make sure the project js directory exists.
mkdir -p ${JS_PATH}/${PROJECT_NAME}

# -------------------------------------------------------[ Sym Linked Output ]--
# Make sure the Google Closure Library is
# sym-linked into the public js space.
if [ ! -d "${LINKED_LIBS_PATH}/google-closure-library/closure" ]; then
    echo "There is no symlink to the Closure Library. Make it now"
    ln -sf ${NODE_MODULES}/google-closure-library ${LINKED_LIBS_PATH}/google-closure-library
fi
CLOSURE_LIBRARY_PATH=${LINKED_LIBS_PATH}/google-closure-library/closure
GOOG_BIN_PATH=${CLOSURE_LIBRARY_PATH}/bin/build

# Make sure the Bad Library is sym-linked into the public js space.
if [ ! -d "${LINKED_LIBS_PATH}/bad-library/bad" ]; then
    echo "There is no symlink to the Bad Library. Make it now"
    ln -sf ${NODE_MODULES}/bad-library ${LINKED_LIBS_PATH}/bad-library
fi
BAD_LIBRARY_PATH=${LINKED_LIBS_PATH}/bad-library/bad

echo "--------------------------------------------------------[ Building... ]--"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "SITE_VERSION: ${SITE_VERSION}"
echo "WORKSPACE:    ${WORKSPACE}"
echo "BUILD_JOB:    ${BUILD_JOB}"
echo "BUILD_PARM:   ${BUILD_PARM}"
echo ""

case "${BUILD_JOB}" in

    # Prepare the Closure Development Environment
    build)  echo "Complete build"
        rm -rf ${NODE_MODULES}
        npm cache clean
        npm install
        npm run cde
        npm run compile
        ;;

    # Prepare the Closure Development Environment
    cde)  echo "Basic Development Bootstrap"
        ${BUILD_PATH}/build_cde.sh \
            ${WORKSPACE} \
            ${BUILD_PATH} \
            ${CLOSURE_LIBRARY_PATH} \
            ${PROJECT_NAME}
        ;;

    # Build the deps file needed by Node so we can use goog.provide and require.
    deps_app) echo  "Build App Dependencies"
       ${BUILD_PATH}/deps_app.sh \
            ${WORKSPACE} \
            ${GOOG_BIN_PATH} \
            ${PROJECT_NAME}
       ;;

    # Build the deps file needed by Node so we can use goog.provide and require.
    deps_node) echo  "Build Node Dependencies"
       ${BUILD_PATH}/deps_node.sh \
            ${WORKSPACE} \
            ${GOOG_BIN_PATH} \
            ${PROJECT_NAME}
       ;;

    # Compile the Java Script
    compile_js) echo  "Compile JS"
        time ${BUILD_PATH}/compile-js.sh \
            ${WORKSPACE} \
            ${PROJECT_NAME} \
            ${SITE_VERSION} \
            ${JS_PATH} \
            ${CLOSURE_LIBRARY_PATH} \
            ${BAD_LIBRARY_PATH} \
            ${CLOSURE_COMPILER_PATH} \
            ${COMPILED_OUTPUT_PATH} \
            ${BUILD_LOG_FILE} \
            ${BUILD_PARM}
        ;;

    # Compile the CSS files.
    compile_css)  echo  "Compile CSS"
        time ${BUILD_PATH}/compile-css.sh \
            ${WORKSPACE} \
            ${PROJECT_NAME} \
            ${SITE_VERSION} \
            ${CSS_PATH} \
            ${COMPILED_OUTPUT_PATH} \
            ${LESS_COMPILER} \
            ${BUILD_PARM}
        ;;

    # Lint the node application files.
    lintnode) echo "Lint ${BUILD_PARM}"
        ${BUILD_PATH}/lint.sh ${NODE_ROOT}
       ;;

    # Lint the customer application files.
    lintapp) echo "Lint ${BUILD_PARM}"
        ${BUILD_PATH}/lint.sh ${JS_PATH}/app
       ;;
esac
