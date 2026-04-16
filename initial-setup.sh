#!/bin/bash

echo "Updating system..."
sudo apt update -y
sudo apt upgrade -y

echo "Installing Docker..."
sudo apt install docker.io -y

echo "Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker

echo "Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu

echo "Installing Nginx..."
sudo apt install nginx -y

echo "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo "Pulling Jenkins Docker Image..."
sudo docker pull jenkins/jenkins:lts

echo "Running Jenkins Container..."
sudo docker run -d \
  --name jenkins \
  --restart=always \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

echo "Checking Running Containers..."
sudo docker ps

echo "Checking Jenkins Status..."
sleep 10

sudo docker logs jenkins

echo "Initial setup completed successfully!"
echo "Access Jenkins at: http://YOUR_EC2_IP:8080"