#!/bin/bash
set -e

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Get ECR registry from URI
ECR_REGISTRY=$(echo "${ecr_image_uri}" | cut -d'/' -f1)

# Login to ECR
aws ecr get-login-password --region "${aws_region}" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Pull the latest image
docker pull "${ecr_image_uri}"

# Run the container
docker run -d \
  --name fixit-backend \
  --restart unless-stopped \
  -p ${app_port}:${app_port} \
  -e NODE_ENV=production \
  -e DATABASE_URL="${database_url}" \
  -e REDIS_URL="${redis_url}" \
  -e JWT_SECRET="${jwt_secret}" \
  -e JWT_EXPIRATION="${jwt_expiration}" \
  -e JWT_REFRESH_SECRET="${jwt_refresh_secret}" \
  -e JWT_REFRESH_EXPIRATION="${jwt_refresh_expiration}" \
  -e STRIPE_SECRET_KEY="${stripe_secret_key}" \
  -e STRIPE_WEBHOOK_SECRET="${stripe_webhook_secret}" \
  "${ecr_image_uri}"
