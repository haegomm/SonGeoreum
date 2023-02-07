#!/bin/bash

# frontend build
cd /frontend
npm install
npm run build

# backend build
cd /backend
gradle clean build +x test

# docker container build
cd /
docker compose build --no-cache