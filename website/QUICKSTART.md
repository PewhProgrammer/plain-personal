# Quick Start Guide

Get your personal website platform running on AWS in under 15 minutes.

## Prerequisites

- AWS account with admin access
- AWS CLI configured (`aws configure`)
- Node.js 18+ installed
- Pulumi CLI installed

```bash
# Install Pulumi (macOS)
brew install pulumi

# Verify installations
node --version   # Should be 18.x or higher
pulumi version   # Should show version
aws sts get-caller-identity  # Should show your AWS identity
```

## Step 1: Clone and Install (2 minutes)

```bash
# Navigate to the project directory
cd /Users/thinhtran/personal/website

# Install all dependencies
npm install
```

This installs dependencies for all packages in the monorepo using npm workspaces.

## Step 2: Set Up Pulumi Backend (3 minutes)

Run the interactive setup script:

```bash
npm run setup
```

When prompted:
- **S3 bucket name**: Enter a unique name (e.g., `my-website-pulumi-state-2024`)
- **AWS region**: Press Enter for default (us-east-1) or enter your preferred region

This script:
1. Creates an S3 bucket for Pulumi state
2. Enables versioning on the bucket
3. Configures Pulumi to use the S3 backend
4. Initializes a 'dev' stack

## Step 3: Deploy to AWS (5-10 minutes)

```bash
npm run deploy:dev
```

This will:
1. Build all TypeScript packages
2. Build Lambda handlers and frontends
3. Show you a preview of resources to be created
4. Ask for confirmation

**Type `yes` and press Enter** to deploy.

CloudFront distributions take 5-10 minutes to provision. Grab a coffee!

## Step 4: Get Your URLs

After deployment completes, view your URLs:

```bash
npm run outputs
```

You'll see something like:

```
Current stack outputs:
    OUTPUT                          VALUE
    landingPageUrl                  https://d1234567890abc.cloudfront.net
    photoFrontendUrl                https://d0987654321xyz.cloudfront.net
    photoApiUrl                     https://abc123.execute-api.us-east-1.amazonaws.com
    photoStorageBucket              photo-backend-storage-abc123
    region_output                   us-east-1
```

## Step 5: Test It Out! (2 minutes)

1. **Open your landing page**: Copy the `landingPageUrl` and open in browser
2. **Open photo sharing app**: Click "Open App" button
3. **Create an album**: Fill in the form and click "Create Album"
4. **Upload photos**: Select some images and click "Upload All"
5. **Share the link**: Copy the album URL and open in an incognito window

That's it! Your personal website is live on AWS! 🎉

## Next Steps

### Local Development

Run frontends locally while using deployed backend:

```bash
# Landing page (port 5173)
npm run dev:landing

# Photo sharing (port 5174)
VITE_API_BASE_URL=<your-photoApiUrl> npm run dev:photo
```

### Update Frontends

After making changes to frontend code:

```bash
# Rebuild and redeploy
npm run build:landing  # or build:photo-frontend
cd infra && pulumi up
```

### Update Backend

After making changes to Lambda code:

```bash
# Rebuild and redeploy
npm run build:backend
cd infra && pulumi up
```

### Deploy to Production

```bash
cd infra

# Create production stack
pulumi stack init prod
pulumi config set aws:region us-east-1
pulumi config set website:environment prod

# Deploy
cd ..
npm run deploy:prod
```

## Costs

For low traffic (1000 page views/month, 100 photo uploads/month):
- **Expected cost: $0.25-$1.00 per month**

This includes:
- S3 storage and requests
- CloudFront data transfer
- Lambda invocations (mostly free tier)
- API Gateway requests
- DynamoDB operations (free tier)

## Troubleshooting

### Deployment fails with "bucket already exists"
The S3 bucket names must be globally unique. Try a different name for the Pulumi state bucket.

### Can't access CloudFront URL
CloudFront can take 10-15 minutes to fully deploy. Wait a bit and try again.

### CORS errors in browser console
Make sure you're using the correct API URL. Check `photoApiUrl` in stack outputs.

### "No such file or directory" during deployment
Make sure you've run `npm run build:all` before deploying infrastructure.

## Clean Up

To delete all AWS resources and stop incurring charges:

```bash
cd infra
pulumi destroy
```

**Warning**: This deletes all data including photos and albums!

## Getting Help

- Read the full [Deployment Guide](./DEPLOYMENT.md)
- Review the [Architecture](./ARCHITECTURE.md)
- Check [Development Guide](./DEVELOPMENT.md) for local dev setup
- Review the main [README](./README.md)

## Project Structure

```
.
├── infra/                    # Pulumi infrastructure
├── apps/
│   ├── landing/             # Landing page (React)
│   └── photo-sharing/
│       ├── frontend/        # Photo app frontend (React)
│       └── backend/         # Lambda handlers (Node.js)
├── packages/
│   └── shared-types/        # Shared TypeScript types
└── scripts/                 # Deployment scripts
```

## Common Commands

```bash
# Install dependencies
npm install

# Build everything
npm run build:all

# Deploy to dev
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# View stack outputs
npm run outputs

# Preview changes before deploying
npm run preview

# Run landing page locally
npm run dev:landing

# Run photo app locally
npm run dev:photo

# Clean build artifacts
npm run clean
```

## What Just Got Deployed?

Your AWS account now has:

**Networking & CDN**:
- 2 CloudFront distributions (CDNs for your websites)
- 3 S3 buckets (2 for static hosting, 1 for photos)

**Compute**:
- 5 Lambda functions (your backend API)
- 1 API Gateway HTTP API (routes requests to Lambdas)

**Storage**:
- 1 DynamoDB table (album and image metadata)

**Security**:
- IAM roles and policies (least-privilege access)
- CloudFront Origin Access Identities (secure S3 access)

**Total resources**: ~15 AWS resources created

All resources are tagged with the environment and can be easily identified in the AWS Console.
