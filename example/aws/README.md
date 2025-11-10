# AWS Deployment Guide for Booker Backend

This directory contains AWS deployment configurations for the Booker backend application.

## Directory Structure

```
aws/
├── docker/              # Docker configurations
│   ├── Dockerfile       # Multi-stage Docker build
│   └── docker-compose.yml
├── ecs/                 # ECS configurations
│   └── task-definition.json
├── cloudformation/      # CloudFormation templates
│   └── backend-stack.yaml
├── sam/                 # AWS SAM templates (Serverless)
│   └── template.yaml
└── scripts/             # Deployment scripts
    ├── deploy.sh
    └── setup-secrets.sh
```

## Deployment Options

### Option 1: ECS Fargate (Recommended for production)

1. **Prerequisites**
   - AWS CLI configured
   - Docker installed
   - ECR repository created
   - VPC and subnets configured
   - DocumentDB or MongoDB Atlas cluster

2. **Setup Secrets**

   ```bash
   cd scripts
   chmod +x setup-secrets.sh
   ./setup-secrets.sh us-east-1 "mongodb://..." "https://your-frontend.com"
   ```

3. **Deploy Infrastructure**

   ```bash
   aws cloudformation create-stack \
     --stack-name booker-backend \
     --template-body file://cloudformation/backend-stack.yaml \
     --parameters \
       ParameterKey=Environment,ParameterValue=production \
       ParameterKey=VpcId,ParameterValue=vpc-xxxxx \
       ParameterKey=SubnetIds,ParameterValue=subnet-xxxxx,subnet-yyyyy \
       ParameterKey=DatabaseEndpoint,ParameterValue=cluster-endpoint.docdb.amazonaws.com \
     --capabilities CAPABILITY_NAMED_IAM
   ```

4. **Build and Push Docker Image**
   ```bash
   cd scripts
   chmod +x deploy.sh
   ./deploy.sh production us-east-1
   ```

### Option 2: AWS SAM (Serverless)

1. **Install SAM CLI**

   ```bash
   brew install aws-sam-cli  # macOS
   # or
   pip install aws-sam-cli
   ```

2. **Build and Deploy**

   ```bash
   cd sam
   sam build
   sam deploy --guided
   ```

3. **Update Lambda Functions**
   - Each API endpoint is a separate Lambda function
   - Functions are defined in `template.yaml`
   - Deploy individual functions: `sam deploy --function-name GetBookingsFunction`

### Option 3: Docker Compose (Local/Development)

1. **Run with Docker Compose**

   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Access the API**
   - Backend: http://localhost:3000
   - MongoDB: localhost:27017

## Environment Variables

### Required

- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS

### Optional

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Database Options

### AWS DocumentDB

```bash
MONGODB_URI=mongodb://username:password@cluster-endpoint:27017/booker?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
```

### MongoDB Atlas

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booker?retryWrites=true&w=majority
```

### Local MongoDB

```bash
MONGODB_URI=mongodb://localhost:27017/booker
```

## Security

1. **Secrets Management**
   - Use AWS Secrets Manager for sensitive data
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **Network Security**
   - Use VPC for ECS services
   - Configure security groups properly
   - Use ALB with HTTPS (SSL certificate required)

3. **IAM Roles**
   - Use least privilege principle
   - Separate execution and task roles
   - Use role-based access control

## Monitoring

1. **CloudWatch Logs**
   - Logs are automatically sent to CloudWatch
   - Log group: `/ecs/booker-backend`

2. **CloudWatch Metrics**
   - ECS service metrics
   - ALB metrics
   - Application metrics

3. **Health Checks**
   - Health endpoint: `/health`
   - Configured in ECS task definition
   - ALB health checks

## Scaling

1. **Auto Scaling**
   - Configure ECS service auto scaling
   - Set min/max capacity
   - Configure scaling policies

2. **Load Balancing**
   - Use Application Load Balancer
   - Configure target groups
   - Set up health checks

## Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Right-size** your containers (CPU/memory)
3. **Use Reserved Capacity** for production
4. **Enable CloudWatch Logs retention** policies
5. **Use S3** for storing Docker images (if not using ECR)

## Troubleshooting

1. **Check ECS Service Events**

   ```bash
   aws ecs describe-services \
     --cluster booker-backend-production \
     --services booker-backend-service-production
   ```

2. **Check CloudWatch Logs**

   ```bash
   aws logs tail /ecs/booker-backend --follow
   ```

3. **Check Task Status**

   ```bash
   aws ecs list-tasks --cluster booker-backend-production
   ```

4. **Test Health Endpoint**
   ```bash
   curl https://your-alb-dns-name.region.elb.amazonaws.com/health
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy
        run: ./aws/scripts/deploy.sh production us-east-1
```

## Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Docker Documentation](https://docs.docker.com/)
