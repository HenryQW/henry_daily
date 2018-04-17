#!/bin/bash
sudo docker build -t wangqiru/api . && sudo docker rm api -f && sudo docker-compose up -d
