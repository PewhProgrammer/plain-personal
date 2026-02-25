# Examples and Reference

This document provides example outputs, configurations, and common use cases.

## Pulumi Stack Outputs

After deploying with `pulumi up`, you'll see outputs like this:

```
Outputs:
    environment_output    : "dev"
    frontendConfig        : {
        apiBaseUrl       : "https://abc123xyz.execute-api.us-east-1.amazonaws.com"
        landingPageUrl   : "https://d1234567890abc.cloudfront.net"
        photoSharingUrl  : "https://d0987654321xyz.cloudfront.net"
    }
    landingPageBucket         : "landing-page-bucket-a1b2c3d"
    landingPageDistributionId : "E1A2B3C4D5E6F7"
    landingPageUrl            : "https://d1234567890abc.cloudfront.net"
    photoApiUrl               : "https://abc123xyz.execute-api.us-east-1.amazonaws.com"
    photoFrontendBucket       : "photo-frontend-bucket-x9y8z7w"
    photoFrontendDistributionId: "E9Z8Y7X6W5V4U3"
    photoFrontendUrl          : "https://d0987654321xyz.cloudfront.net"
    photoMetadataTable        : "photo-backend-metadata-abc123"
    photoStorageBucket        : "photo-backend-storage-abc123"
    region_output             : "us-east-1"

Resources:
    + 42 created

Duration: 8m45s
```

## API Examples

### Create Album

**Request**:
```bash
curl -X POST https://abc123xyz.execute-api.us-east-1.amazonaws.com/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Vacation 2024",
    "description": "Photos from our trip to Hawaii"
  }'
```

**Response** (201 Created):
```json
{
  "albumId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Summer Vacation 2024",
  "description": "Photos from our trip to Hawaii",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Get Album

**Request**:
```bash
curl https://abc123xyz.execute-api.us-east-1.amazonaws.com/albums/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response** (200 OK):
```json
{
  "album": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Summer Vacation 2024",
    "description": "Photos from our trip to Hawaii",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  },
  "images": [
    {
      "id": "img-001",
      "albumId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "originalFileName": "sunset.jpg",
      "contentType": "image/jpeg",
      "uploadedAt": "2024-01-15T10:45:00.000Z",
      "uploaderName": "John Doe"
    },
    {
      "id": "img-002",
      "albumId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "originalFileName": "beach.jpg",
      "contentType": "image/jpeg",
      "uploadedAt": "2024-01-15T10:46:00.000Z"
    }
  ]
}
```

### Get Upload URL

**Request**:
```bash
curl -X POST https://abc123xyz.execute-api.us-east-1.amazonaws.com/albums/a1b2c3d4-e5f6-7890-abcd-ef1234567890/upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "photo.jpg",
    "contentType": "image/jpeg",
    "uploaderName": "Jane Smith"
  }'
```

**Response** (200 OK):
```json
{
  "uploadUrl": "https://photo-backend-storage-abc123.s3.us-east-1.amazonaws.com/albums/a1b2c3d4.../img-003.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "imageId": "img-003",
  "fileKey": "albums/a1b2c3d4-e5f6-7890-abcd-ef1234567890/img-003.jpg"
}
```

### Upload File to S3

**Request**:
```bash
curl -X PUT "https://photo-backend-storage-abc123.s3.us-east-1.amazonaws.com/albums/...?X-Amz-Algorithm=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @photo.jpg
```

**Response** (200 OK):
```
(Empty body, check for 200 status code)
```

### Get Download URL

**Request**:
```bash
curl https://abc123xyz.execute-api.us-east-1.amazonaws.com/albums/a1b2c3d4-e5f6-7890-abcd-ef1234567890/download-url/img-001
```

**Response** (200 OK):
```json
{
  "downloadUrl": "https://photo-backend-storage-abc123.s3.us-east-1.amazonaws.com/albums/a1b2c3d4.../img-001.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "image": {
    "id": "img-001",
    "albumId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "originalFileName": "sunset.jpg",
    "contentType": "image/jpeg",
    "uploadedAt": "2024-01-15T10:45:00.000Z",
    "uploaderName": "John Doe"
  }
}
```

## DynamoDB Schema Examples

### Album Item

```json
{
  "PK": "ALBUM#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "METADATA",
  "entityType": "Album",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Summer Vacation 2024",
  "description": "Photos from our trip to Hawaii",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:45:00.000Z"
}
```

### Image Item

```json
{
  "PK": "ALBUM#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "IMAGE#img-001",
  "entityType": "Image",
  "id": "img-001",
  "albumId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "originalFileName": "sunset.jpg",
  "contentType": "image/jpeg",
  "uploadedAt": "2024-01-15T10:45:00.000Z",
  "uploaderName": "John Doe"
}
```

## S3 Bucket Structure

### Photo Storage Bucket

```
photo-backend-storage-abc123/
└── albums/
    ├── album-id-1/
    │   ├── image-id-1.jpg
    │   ├── image-id-2.png
    │   └── image-id-3.gif
    ├── album-id-2/
    │   ├── image-id-4.jpg
    │   └── image-id-5.jpg
    └── album-id-3/
        └── image-id-6.jpg
```

### Static Hosting Buckets

```
landing-page-bucket-a1b2c3d/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js
│   └── index-e5f6g7h8.css
└── favicon.ico

photo-frontend-bucket-x9y8z7w/
├── index.html
├── assets/
│   ├── index-x9y8z7w6.js
│   └── index-v5u4t3s2.css
└── favicon.ico
```

## Environment Files

### Landing Page (.env.local)

```bash
# apps/landing/.env.local
VITE_PHOTO_SHARING_URL=https://d0987654321xyz.cloudfront.net
```

### Photo Sharing Frontend (.env.local)

```bash
# apps/photo-sharing/frontend/.env.local
VITE_API_BASE_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

## Stack Configuration Examples

### Development Stack (Pulumi.dev.yaml)

```yaml
config:
  aws:region: us-east-1
  website:environment: dev
  website:domainName: ""
```

### Production Stack (Pulumi.prod.yaml)

```yaml
config:
  aws:region: us-east-1
  website:environment: prod
  website:domainName: "example.com"
```

### Multi-Region Production (Pulumi.prod-eu.yaml)

```yaml
config:
  aws:region: eu-west-1
  website:environment: prod
  website:domainName: "eu.example.com"
```

## Common Workflows

### Complete Upload Flow

```bash
# 1. Create album
ALBUM_RESPONSE=$(curl -X POST https://api.com/albums \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Album"}')

ALBUM_ID=$(echo $ALBUM_RESPONSE | jq -r '.albumId')

# 2. Get upload URL
UPLOAD_RESPONSE=$(curl -X POST https://api.com/albums/$ALBUM_ID/upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName": "test.jpg", "contentType": "image/jpeg"}')

UPLOAD_URL=$(echo $UPLOAD_RESPONSE | jq -r '.uploadUrl')
IMAGE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.imageId')

# 3. Upload file
curl -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/jpeg" \
  --data-binary @test.jpg

# 4. Get album with images
curl https://api.com/albums/$ALBUM_ID

# 5. Get download URL
curl https://api.com/albums/$ALBUM_ID/download-url/$IMAGE_ID
```

### Local Development Workflow

```bash
# Terminal 1: Build and watch shared types
cd packages/shared-types
npm run watch

# Terminal 2: Run landing page
cd apps/landing
npm run dev

# Terminal 3: Run photo sharing app
cd apps/photo-sharing/frontend
VITE_API_BASE_URL=https://your-api.com npm run dev

# Terminal 4: Deploy backend changes
cd infra
pulumi watch  # Auto-deploy on changes
```

## Cost Examples

### Low Traffic (Personal Use)

**Assumptions**:
- 1,000 page views/month
- 100 photo uploads/month
- 10 GB photo storage
- 5 GB data transfer

**Monthly Cost Breakdown**:
```
S3 Storage (10 GB):                    $0.23
S3 Requests (1,000):                   $0.00
CloudFront (5 GB):                     $0.43
Lambda (1,000 invocations):            $0.00 (free tier)
API Gateway (1,000 requests):          $0.00
DynamoDB (1,000 requests):             $0.00 (free tier)
----------------------------------------
Total:                                 $0.66/month
```

### Medium Traffic (Family/Friends)

**Assumptions**:
- 50,000 page views/month
- 5,000 photo uploads/month
- 100 GB photo storage
- 200 GB data transfer

**Monthly Cost Breakdown**:
```
S3 Storage (100 GB):                   $2.30
S3 Requests (50,000):                  $0.02
CloudFront (200 GB):                   $17.00
Lambda (50,000 invocations):           $0.01
API Gateway (50,000 requests):         $0.05
DynamoDB (50,000 requests):            $0.06
----------------------------------------
Total:                                 $19.44/month
```

### High Traffic (Community)

**Assumptions**:
- 1M page views/month
- 100,000 photo uploads/month
- 1 TB photo storage
- 2 TB data transfer

**Monthly Cost Breakdown**:
```
S3 Storage (1 TB):                     $23.00
S3 Requests (1M):                      $0.50
CloudFront (2 TB):                     $170.00
Lambda (1M invocations):               $0.20
API Gateway (1M requests):             $1.00
DynamoDB (1M requests):                $1.30
----------------------------------------
Total:                                 $196.00/month
```

## Monitoring Examples

### CloudWatch Dashboard Query

```bash
# Get Lambda error rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=photo-backend-createAlbum-dev \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Cost Explorer Query

```bash
# Get this month's costs
aws ce get-cost-and-usage \
  --time-period Start=$(date -u -d "$(date +%Y-%m-01)" +%Y-%m-%d),End=$(date -u +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics "BlendedCost" "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE
```

## Troubleshooting Examples

### Check Lambda Execution

```bash
# Get recent executions
aws lambda invoke \
  --function-name photo-backend-createAlbum-dev \
  --payload '{"body": "{\"title\": \"Test\"}"}' \
  response.json

cat response.json
```

### Verify S3 Bucket CORS

```bash
aws s3api get-bucket-cors \
  --bucket photo-backend-storage-abc123
```

### Check API Gateway Routes

```bash
# List APIs
aws apigatewayv2 get-apis

# List routes for an API
aws apigatewayv2 get-routes --api-id abc123xyz
```

### CloudFront Invalidation

```bash
# Invalidate all files
aws cloudfront create-invalidation \
  --distribution-id E1A2B3C4D5E6F7 \
  --paths "/*"
```

## Testing Examples

### Load Test with Apache Bench

```bash
# Test API Gateway endpoint
ab -n 1000 -c 10 https://abc123xyz.execute-api.us-east-1.amazonaws.com/albums/test-album-id

# Test CloudFront
ab -n 1000 -c 10 https://d1234567890abc.cloudfront.net/
```

### Integration Test Script

```bash
#!/bin/bash
set -e

API_URL="https://abc123xyz.execute-api.us-east-1.amazonaws.com"

echo "Creating album..."
ALBUM=$(curl -s -X POST $API_URL/albums \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Album"}')

ALBUM_ID=$(echo $ALBUM | jq -r '.albumId')
echo "Created album: $ALBUM_ID"

echo "Getting upload URL..."
UPLOAD=$(curl -s -X POST $API_URL/albums/$ALBUM_ID/upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName": "test.jpg", "contentType": "image/jpeg"}')

UPLOAD_URL=$(echo $UPLOAD | jq -r '.uploadUrl')
echo "Got upload URL"

echo "Uploading test image..."
curl -s -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/jpeg" \
  --data-binary @test.jpg

echo "Getting album..."
curl -s $API_URL/albums/$ALBUM_ID | jq .

echo "✅ Integration test passed!"
```

This provides comprehensive examples for using and testing the platform.
