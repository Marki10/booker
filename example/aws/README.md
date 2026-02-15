# AWS Deployment Example

Client - CloudFront (CDN) - S3 (Next.js static frontend) - API Gateway - Lambda (Node.js API) - RDS PostgreSQL (private subnet)

This directory contains an example AWS CloudFormation template for deploying the Booking App.

## Architecture

- **CloudFront + S3** - Static frontend hosting
- **API Gateway + Lambda** - Serverless API
- **RDS PostgreSQL** - Database (in private subnet)

## Quick Setup

### Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions

### Deploy

```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name booking-app-prod \
  --template-body file://production-architecture.yaml \
  --capabilities CAPABILITY_NAMED_IAM

# Check status
aws cloudformation describe-stacks --stack-name booking-app-prod

# Get outputs (URLs, endpoints)
aws cloudformation describe-stacks \
  --stack-name booking-app-prod \
  --query 'Stacks[0].Outputs'
```

### Deploy Frontend

```bash
# Build Next.js app
npm run build

# Sync to S3
aws s3 sync out/ s3://booking-app-prod-frontend/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

### Configure Frontend

Set the API URL in your frontend:

```env
NEXT_PUBLIC_API_URL=https://<api-gateway-url>/api
```

## Cleanup

```bash
aws cloudformation delete-stack --stack-name booking-app-prod
```
