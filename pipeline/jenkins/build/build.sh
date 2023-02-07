#!/bin/bash

# frontend build
cd /home/ubuntu/S08P12B106/frontend
npm install
npm run build

# backend build
cd /home/ubuntu/S08P12B106/backend
gradle clean build +x test

# docker container build
cd /home/ubuntu
docker compose build --no-cache