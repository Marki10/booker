#!/bin/bash

# Script to set up AWS Secrets Manager for Booker Backend

set -e

REGION=${1:-us-east-1}
MONGODB_URI=${2:-""}
FRONTEND_URL=${3:-""}

echo "Setting up AWS Secrets Manager for Booker Backend"
echo "Region: $REGION"

# Create MongoDB URI secret
if [ -n "$MONGODB_URI" ]; then
  echo "Creating MongoDB URI secret..."
  aws secretsmanager create-secret \
    --name booker/mongodb-uri \
    --description "MongoDB connection string for Booker backend" \
    --secret-string "$MONGODB_URI" \
    --region $REGION \
    --no-cli-pager || \
  aws secretsmanager update-secret \
    --secret-id booker/mongodb-uri \
    --secret-string "$MONGODB_URI" \
    --region $REGION \
    --no-cli-pager
  echo "MongoDB URI secret created/updated"
else
  echo "MONGODB_URI not provided, skipping..."
fi

# Create Frontend URL secret
if [ -n "$FRONTEND_URL" ]; then
  echo "Creating Frontend URL secret..."
  aws secretsmanager create-secret \
    --name booker/frontend-url \
    --description "Frontend URL for CORS configuration" \
    --secret-string "$FRONTEND_URL" \
    --region $REGION \
    --no-cli-pager || \
  aws secretsmanager update-secret \
    --secret-id booker/frontend-url \
    --secret-string "$FRONTEND_URL" \
    --region $REGION \
    --no-cli-pager
  echo "Frontend URL secret created/updated"
else
  echo "FRONTEND_URL not provided, skipping..."
fi

echo "Secrets setup complete!"

