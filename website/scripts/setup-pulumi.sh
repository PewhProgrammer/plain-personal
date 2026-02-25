#!/bin/bash
set -e

echo "🔧 Setting up Pulumi backend"
echo ""

# Get S3 bucket name
read -p "Enter S3 bucket name for Pulumi state (e.g., my-pulumi-state-bucket): " BUCKET_NAME

# Get AWS region
read -p "Enter AWS region (default: us-east-1): " REGION
REGION=${REGION:-us-east-1}

# Create S3 bucket
echo ""
echo "Creating S3 bucket: $BUCKET_NAME in region $REGION"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Enable versioning
echo "Enabling versioning on bucket..."
aws s3api put-bucket-versioning \
  --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled

# Configure Pulumi
echo ""
echo "Configuring Pulumi to use S3 backend..."
cd infra
pulumi login s3://$BUCKET_NAME

# Initialize dev stack
echo ""
echo "Initializing 'dev' stack..."
pulumi stack init dev --secrets-provider passphrase || pulumi stack select dev

# Set region
pulumi config set aws:region $REGION
pulumi config set website:environment dev

echo ""
echo "✅ Pulumi setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review and update infra/Pulumi.dev.yaml with your configuration"
echo "  2. Run: npm run deploy:all"
