#!/bin/bash
sudo docker build -t wangqiru/api . && sudo rm api -f && sudo docker-compose up -d
