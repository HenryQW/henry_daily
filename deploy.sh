#!/bin/bash
sudo docker build -t wangqiru/api . && (sudo docker stop api || true && sudo docker rm api || true)&& sudo docker-compose up -d
