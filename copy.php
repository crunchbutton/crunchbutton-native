#!/usr/bin/env php
<?php

error_reporting(E_ALL ^ (E_NOTICE | E_STRICT));

shell_exec('cp -R www/* platforms/ios/www/');

echo 'copy complete';
