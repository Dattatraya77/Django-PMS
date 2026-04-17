#!/bin/bash

echo "Updating system..."
sudo apt update -y

sudo apt install -y \
python3-pip \
python3-dev \
python3-venv \
python-is-python3 \
build-essential \
libpq-dev \
nginx \
git \
curl