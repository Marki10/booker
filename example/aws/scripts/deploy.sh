#!/bin/bash

# Deployment script for Booker Backend to AWS

set -e

ENVIRONMENT=${1:-production}
REGION=${2:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Deploying Booker Backend to AWS"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Account ID: $AWS_ACCOUNT_ID"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build Docker image
echo "Building Docker image..."
cd ../../backend
docker build -f ../aws/docker/Dockerfile -t booker-backend:latest .

# Tag image
echo "Tagging image..."
docker tag booker-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/booker-backend:latest
docker tag booker-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/booker-backend:$ENVIRONMENT

# Push image to ECR
echo "Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/booker-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/booker-backend:$ENVIRONMENT

# Update ECS service
echo "Updating ECS service..."
aws ecs update-service \
  --cluster booker-backend-$ENVIRONMENT \
  --service booker-backend-service-$ENVIRONMENT \
  --force-new-deployment \
  --region $REGION

echo "Deployment complete!"

