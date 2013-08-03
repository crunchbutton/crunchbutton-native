#!/bin/sh
DST_DIR="./platforms/ios/www/"
SERVER="http://beta.crunchr.co/"

wget -O - --header="Accept-Encoding: gzip" "${SERVER}assets/js/bundle.js" | gunzip > "${DST_DIR}js/bundle.js"
wget -O - --header="Accept-Encoding: gzip" "${SERVER}assets/css/bundle.css" | gunzip > "${DST_DIR}css/bundle.css"