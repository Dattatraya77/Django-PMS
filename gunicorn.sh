#!/bin/bash

echo "Copying Gunicorn service files..."

sudo cp gunicorn.service /etc/systemd/system/
sudo cp gunicorn.socket /etc/systemd/system/

echo "Reloading system daemon..."

sudo systemctl daemon-reload

echo "Starting Gunicorn..."

sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket

sudo systemctl start gunicorn
sudo systemctl enable gunicorn

echo "Gunicorn Setup Completed"