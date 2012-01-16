#!/bin/bash

cd /opt/ping_server
git pull
service httpd restart
echo "Update of ping server complete"

