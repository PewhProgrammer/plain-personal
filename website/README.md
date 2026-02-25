# Personal Website Platform

A cost-efficient serverless personal website platform built on AWS using Pulumi IaC.

## Architecture

- **Static Hosting**: S3 + CloudFront for all frontends
- **Backend**: AWS Lambda (Node.js) + API Gateway HTTP API
- **Storage**: S3 for images and files
- **Infrastructure**: Pulumi (TypeScript) with S3 backend state storage

## Monorepo Structure

```
.
├── infra/                  # Pulumi infrastructure code
│   ├── index.ts           # Main Pulumi program
│   ├── components/        # Reusable infrastructure components
│   └── Pulumi.*.yaml      # Stack configurations
├── apps/
│   ├── landing/           # Landing page frontend
│   └── photo-sharing/     # Photo sharing app
│       ├── frontend/      # React SPA
│       └── backend/       # Lambda handlers
├── packages/              # Shared utilities
│   └── shared-types/      # TypeScript types shared across apps
└── scripts/               # Build and deployment scripts
```

## Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with credentials
- Pulumi CLI installed (`brew install pulumi` on macOS)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Pulumi Backend

First, create an S3 bucket for Pulumi state:

```bash
aws s3 mb s3://my-pulumi-state-bucket --region us-east-1
```

Then configure Pulumi to use it:

```bash
cd infra
pulumi login s3://my-pulumi-state-bucket
pulumi stack init dev
```

### 3. Configure the Stack

Edit `infra/Pulumi.dev.yaml`:

```yaml
config:
  aws:region: us-east-1
  website:domainName: ""  # Optional: your custom domain
```

### 4. Deploy Infrastructure

```bash
cd infra
npm run deploy
```

This will output the URLs for your landing page, photo sharing app, and API.

### 5. Build and Deploy Frontends

```bash
# From project root
npm run build:all
npm run deploy:frontends
```

## Development

### Run Landing Page Locally

```bash
cd apps/landing
npm run dev
# Opens on http://localhost:5173
```

### Run Photo Sharing App Locally

```bash
cd apps/photo-sharing/frontend
npm run dev
# Opens on http://localhost:5174
```

### Deploy Individual Components

```bash
# Deploy infrastructure only
npm run deploy:infra

# Deploy frontends only (after infra is deployed)
npm run deploy:frontends

# Deploy everything
npm run deploy:all
```

## Cost Optimization Features

- **Pay-per-use**: Lambda and API Gateway HTTP API charge only per request
- **S3 Lifecycle Rules**: Automatically transition old images to cheaper storage tiers
- **CloudFront Caching**: Reduces S3 GET requests
- **Minimal Lambda Resources**: 256MB memory, short timeouts for simple handlers
- **On-Demand DynamoDB**: Pay only for actual read/write operations

### Expected Monthly Costs (Low Traffic)

For ~1,000 page views/month and ~100 image uploads:
- S3: $0.02 (1GB storage)
- CloudFront: $0.10 (1GB transfer)
- Lambda: $0.00 (well within free tier)
- API Gateway: $0.10 (1,000 requests)
- **Total: ~$0.25/month**

## Stacks

- **dev**: Development/testing environment
- **prod**: Production environment

Switch stacks:
```bash
cd infra
pulumi stack select prod
pulumi up
```

## Photo Sharing API

### Endpoints

- `POST /albums` - Create new album
- `GET /albums/{albumId}` - Get album details
- `GET /albums/{albumId}/images` - List images in album
- `POST /albums/{albumId}/upload-url` - Get presigned upload URL
- `GET /albums/{albumId}/download-url/{imageId}` - Get presigned download URL

### Security Model

- Link-based sharing with cryptographically random album IDs
- Presigned URLs for direct S3 uploads/downloads (no data through Lambda)
- CORS configured for frontend domains only

## Troubleshooting

### Pulumi State Issues

```bash
# Check current state
cd infra
pulumi stack ls

# Refresh state
pulumi refresh
```

### Lambda Logs

```bash
# View logs for a specific function
aws logs tail /aws/lambda/photo-api-createAlbum-dev --follow
```

### Clear CloudFront Cache

```bash
# After deploying new frontend assets
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

## Contributing

This is a personal project, but feel free to fork and adapt for your own use.

## License

MIT
