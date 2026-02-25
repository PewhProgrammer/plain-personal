# Deployment Guide

This guide walks you through deploying the personal website platform to AWS using Pulumi.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions to create:
   - S3 buckets
   - CloudFront distributions
   - Lambda functions
   - API Gateway HTTP APIs
   - DynamoDB tables
   - IAM roles and policies

2. **AWS CLI**: Install and configure with your credentials
   ```bash
   aws configure
   ```

3. **Pulumi CLI**: Install Pulumi
   ```bash
   # macOS
   brew install pulumi

   # Linux
   curl -fsSL https://get.pulumi.com | sh

   # Windows
   choco install pulumi
   ```

4. **Node.js**: Version 18 or later
   ```bash
   node --version  # Should be 18.x or higher
   ```

## Step 1: Install Dependencies

From the project root:

```bash
npm install
```

This will install dependencies for all packages and apps in the monorepo.

## Step 2: Set Up Pulumi Backend

The Pulumi state will be stored in an S3 bucket for team collaboration and durability.

### Option A: Using the setup script (Recommended)

```bash
npm run setup
```

This interactive script will:
1. Prompt you for an S3 bucket name
2. Create the bucket with versioning enabled
3. Configure Pulumi to use this bucket
4. Initialize the 'dev' stack

### Option B: Manual setup

```bash
# Create S3 bucket for Pulumi state
aws s3 mb s3://my-pulumi-state-bucket --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-pulumi-state-bucket \
  --versioning-configuration Status=Enabled

# Configure Pulumi
cd infra
pulumi login s3://my-pulumi-state-bucket

# Initialize stack
pulumi stack init dev

# Set configuration
pulumi config set aws:region us-east-1
pulumi config set website:environment dev
```

## Step 3: Review Stack Configuration

Edit `infra/Pulumi.dev.yaml` to customize your deployment:

```yaml
config:
  aws:region: us-east-1
  website:environment: dev
  website:domainName: ""  # Optional: add custom domain
```

## Step 4: Deploy to AWS

### Full deployment (recommended for first time)

```bash
npm run deploy:dev
```

This will:
1. Build all TypeScript packages
2. Build the backend Lambda handlers
3. Build both frontends
4. Deploy all infrastructure to AWS
5. Upload static assets to S3

The deployment takes about 5-10 minutes on first run (CloudFront distributions are slow to create).

### Subsequent deployments

After the initial deployment, you can use:

```bash
# Preview changes before deploying
npm run preview

# Deploy all changes
npm run deploy:dev

# Just deploy infrastructure (no rebuild)
cd infra && pulumi up
```

## Step 5: Get Your URLs

After deployment, get the URLs for your apps:

```bash
npm run outputs
```

Example output:
```
Current stack outputs (5):
    OUTPUT                          VALUE
    landingPageUrl                  https://d1234567890abc.cloudfront.net
    photoFrontendUrl                https://d0987654321xyz.cloudfront.net
    photoApiUrl                     https://abc123.execute-api.us-east-1.amazonaws.com
    photoStorageBucket              photo-backend-storage-abc123
    photoMetadataTable              photo-backend-metadata-abc123
```

## Step 6: Test Your Deployment

1. **Landing Page**: Open the `landingPageUrl` in your browser
2. **Photo Sharing**: Click "Open App" on the landing page or directly open `photoFrontendUrl`
3. **Create an Album**: Create a test album and upload some photos
4. **Share the Link**: Copy the album URL and open it in an incognito window to test link-based sharing

## Production Deployment

To create a production environment:

```bash
cd infra

# Create production stack
pulumi stack init prod

# Configure production settings
pulumi config set aws:region us-east-1
pulumi config set website:environment prod
# Optional: Set custom domain
pulumi config set website:domainName example.com

# Deploy to production
cd ..
npm run deploy:prod
```

## Custom Domain Setup (Optional)

To use a custom domain with CloudFront:

1. **Get SSL Certificate**: Request a certificate in ACM (must be in us-east-1)
   ```bash
   aws acm request-certificate \
     --domain-name example.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Update Pulumi Code**: Modify `infra/components/staticWebsite.ts` to use the certificate:
   ```typescript
   viewerCertificate: {
     acmCertificateArn: "arn:aws:acm:us-east-1:...",
     sslSupportMethod: "sni-only",
   },
   aliases: ["example.com"],
   ```

3. **Update DNS**: Point your domain to the CloudFront distribution
   ```bash
   # Get distribution domain name
   pulumi stack output landingPageUrl

   # Create CNAME or ALIAS record in Route53/your DNS provider
   # example.com -> d1234567890abc.cloudfront.net
   ```

## Updating the Application

### Update frontend code

```bash
# Make changes to frontend code
# Then rebuild and deploy
npm run build:landing  # or build:photo-frontend
cd infra && pulumi up
```

### Update backend code

```bash
# Make changes to Lambda handlers
npm run build:backend
cd infra && pulumi up
```

### Update infrastructure

```bash
# Make changes to Pulumi code
cd infra
pulumi preview  # Review changes
pulumi up       # Apply changes
```

## Destroying Resources

To tear down all AWS resources:

```bash
cd infra
pulumi destroy
```

**Warning**: This will delete all data including:
- All photos in S3
- All album metadata in DynamoDB
- CloudFront distributions
- Lambda functions

Make sure to backup any data you want to keep before destroying.

## Troubleshooting

### CloudFront takes a long time

CloudFront distributions can take 15-20 minutes to fully deploy. This is normal.

### Lambda function not found

Make sure you built the backend before deploying:
```bash
npm run build:backend
cd infra && pulumi up
```

### CORS errors in browser

Check that:
1. The API Gateway CORS configuration allows your frontend domain
2. Lambda functions return proper CORS headers
3. Your frontend is using the correct API URL

### Images not uploading

Check:
1. Lambda has correct IAM permissions for S3
2. S3 bucket CORS configuration allows PUT requests
3. Presigned URLs are not expired (10-minute timeout)

### Out of sync state

If Pulumi state gets out of sync with AWS:
```bash
cd infra
pulumi refresh
```

## Cost Monitoring

Monitor your AWS costs:

```bash
# View current month's costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE
```

Set up billing alerts in AWS Console:
1. Go to AWS Billing > Billing Preferences
2. Enable "Receive Billing Alerts"
3. Create CloudWatch alarm for your budget threshold

## Next Steps

- Set up custom domain with Route53 + ACM
- Add CloudWatch dashboards for monitoring
- Set up CloudWatch alarms for Lambda errors
- Implement backup strategy for DynamoDB
- Add authentication for album creation (Cognito)
- Implement image thumbnails (Lambda + S3 + CloudFront)
- Add CDN invalidation to deployment script for faster updates
