#!/bin/bash

# frontend build
cd /var/jenkins_home/workspace/bbb-pipeline/frontend
npm install
npm run build

# backend build
cd /var/jenkins_home/workspace/bbb-pipeline/backend
gradle clean build -x test

# docker container build
cd /var/jenkins_home/workspace/bbb-pipeline/
docker compose build --no-cache