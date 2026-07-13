#!/bin/bash
set -e

# Wait for cloud-init to finish
cloud-init status --wait

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker, jq, unzip, and curl
sudo apt-get install -y docker.io jq unzip curl

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Clean up
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*
