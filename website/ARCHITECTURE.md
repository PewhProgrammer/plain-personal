# Architecture Overview

This document describes the architecture of the personal website platform.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         End Users                               │
│                                                                 │
└────────┬────────────────────────────────────┬───────────────────┘
         │                                    │
         │ HTTPS                              │ HTTPS
         │                                    │
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   CloudFront CDN    │            │   CloudFront CDN    │
│   (Landing Page)    │            │  (Photo Sharing)    │
└──────────┬──────────┘            └──────────┬──────────┘
           │                                  │
           │                                  │
           ▼                                  ▼
    ┌─────────────┐                   ┌─────────────┐
    │  S3 Bucket  │                   │  S3 Bucket  │
    │   (Static)  │                   │   (Static)  │
    └─────────────┘                   └─────────────┘
                                              │
                                              │ API Calls
                                              │
                                              ▼
                                  ┌─────────────────────┐
                                  │  API Gateway (HTTP) │
                                  └──────────┬──────────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        │                    │                    │
                        ▼                    ▼                    ▼
                 ┌───────────┐        ┌───────────┐      ┌───────────┐
                 │  Lambda   │        │  Lambda   │      │  Lambda   │
                 │ Functions │        │ Functions │      │ Functions │
                 └─────┬─────┘        └─────┬─────┘      └─────┬─────┘
                       │                    │                    │
                       └────────────────────┼────────────────────┘
                                           │
                      ┌────────────────────┼────────────────────┐
                      │                    │                    │
                      ▼                    ▼                    ▼
              ┌──────────────┐     ┌──────────────┐    ┌──────────────┐
              │  DynamoDB    │     │  S3 Bucket   │    │  CloudWatch  │
              │  (Metadata)  │     │  (Images)    │    │    (Logs)    │
              └──────────────┘     └──────────────┘    └──────────────┘
```

## Components

### Frontend Layer

#### Landing Page
- **Technology**: React + Vite
- **Hosting**: S3 + CloudFront
- **Purpose**: Main entry point, app listing
- **Cost**: ~$0.10/month (1GB traffic)

#### Photo Sharing Frontend
- **Technology**: React + React Router + Vite
- **Hosting**: S3 + CloudFront
- **Purpose**: Photo album UI
- **Features**:
  - Create albums
  - Upload photos (direct to S3)
  - View galleries
  - Share album links
- **Cost**: ~$0.10/month (1GB traffic)

### Backend Layer

#### API Gateway (HTTP API)
- **Type**: HTTP API (not REST API for cost savings)
- **Purpose**: Route requests to Lambda functions
- **Endpoints**:
  - `POST /albums` - Create album
  - `GET /albums/{albumId}` - Get album details
  - `GET /albums/{albumId}/images` - List images
  - `POST /albums/{albumId}/upload-url` - Get presigned upload URL
  - `GET /albums/{albumId}/download-url/{imageId}` - Get presigned download URL
- **Features**:
  - CORS enabled for frontends
  - No API keys or authentication (link-based security)
- **Cost**: $1.00 per million requests

#### Lambda Functions
- **Runtime**: Node.js 18.x
- **Memory**: 256 MB (optimized for cost)
- **Timeout**: 30 seconds
- **Functions**:
  1. `createAlbum` - Create new album in DynamoDB
  2. `getAlbum` - Fetch album + images from DynamoDB
  3. `listImages` - List images for an album
  4. `getUploadUrl` - Generate S3 presigned URL for uploads
  5. `getDownloadUrl` - Generate S3 presigned URL for downloads
- **IAM Permissions**:
  - DynamoDB: PutItem, GetItem, Query, UpdateItem
  - S3: PutObject, GetObject (for presigned URLs)
  - CloudWatch: Write logs
- **Cost**: First 1M requests free, then $0.20 per 1M requests

### Storage Layer

#### S3 Buckets

**Static Hosting Buckets (2)**:
- Landing page assets
- Photo sharing frontend assets
- Configured with:
  - Block public access (access via CloudFront OAI only)
  - Versioning disabled (not needed for static assets)
- **Cost**: $0.023 per GB/month

**Photo Storage Bucket**:
- Stores uploaded images
- Configured with:
  - Block public access (access via presigned URLs only)
  - CORS for browser uploads
  - Lifecycle rules:
    - Day 90: Transition to Standard-IA
    - Day 180: Transition to Glacier Instant Retrieval
- **Cost**:
  - Standard: $0.023/GB/month
  - Standard-IA: $0.0125/GB/month (after 90 days)
  - Glacier Instant: $0.004/GB/month (after 180 days)

#### DynamoDB Table

**Metadata Table**:
- **Billing**: On-Demand (pay per request)
- **Schema**: Single-table design
  ```
  PK                    SK                  Attributes
  ALBUM#{id}           METADATA            title, description, createdAt, updatedAt
  ALBUM#{id}           IMAGE#{id}          originalFileName, contentType, uploadedAt, uploaderName
  ```
- **GSI1**: For future queries (e.g., list all albums)
- **Cost**:
  - Write: $1.25 per million requests
  - Read: $0.25 per million requests

### CDN Layer

#### CloudFront Distributions (2)

**Landing Page Distribution**:
- Origin: Landing page S3 bucket
- Price Class: 100 (North America + Europe)
- Certificate: Default CloudFront certificate
- Cache behavior:
  - HTML: No cache (always fresh)
  - JS/CSS: 1 year cache (immutable)
  - Images: 1 day cache
- **Cost**: $0.085 per GB (first 10 TB)

**Photo Frontend Distribution**:
- Similar to landing page
- Handles SPA routing (404 → index.html)

## Data Flow

### Creating an Album

```
User → Frontend → API Gateway → Lambda (createAlbum)
                                    ↓
                                DynamoDB (PutItem)
                                    ↓
                           Return albumId to user
```

### Uploading a Photo

```
1. User selects file in browser
2. Frontend → API Gateway → Lambda (getUploadUrl)
                                ↓
                        Generate presigned URL
                                ↓
                   Save metadata in DynamoDB
                                ↓
                    Return presigned URL
3. Frontend → S3 (PUT directly with presigned URL)
4. Frontend → reload album to see new image
```

### Viewing Photos

```
1. User opens album
2. Frontend → API Gateway → Lambda (getAlbum)
                                ↓
                        Query DynamoDB for album + images
                                ↓
                    Return metadata (no image data)
3. For each image:
   Frontend → API Gateway → Lambda (getDownloadUrl)
                                ↓
                    Generate presigned URL
                                ↓
                    Return presigned URL
4. Frontend → S3 (GET directly with presigned URL)
```

## Security Model

### Authentication & Authorization
- **No traditional auth**: Link-based security
- **Album IDs**: Cryptographically random UUIDs (v4)
- **Security assumption**: If you know the album URL, you can view/upload
- **Protection**: UUID provides ~128 bits of entropy (unguessable)

### Network Security
- All traffic over HTTPS
- S3 buckets are private (no public access)
- Access only via:
  - CloudFront (for static assets)
  - Presigned URLs (for images)
- API Gateway has CORS configured

### IAM Security
- Lambda execution role: Least privilege
- Only permissions needed:
  - DynamoDB: Read/write metadata table
  - S3: Read/write photo storage bucket
  - CloudWatch: Write logs
- No user-facing IAM credentials

## Scalability

### Current Limits
- DynamoDB: On-demand scales automatically
- Lambda: 1000 concurrent executions (default)
- API Gateway: 10,000 requests/second (soft limit)
- S3: Unlimited
- CloudFront: Unlimited

### Bottlenecks
- DynamoDB: None for reasonable traffic
- Lambda: Could hit concurrent execution limit at ~1000 simultaneous uploads
- S3: No bottleneck

### Cost at Scale

**Low Traffic** (1,000 page views/month, 100 uploads/month):
- S3 Storage (1 GB): $0.02
- CloudFront (1 GB): $0.10
- API Gateway (1,000 requests): $0.00
- Lambda (1,000 invocations): $0.00
- DynamoDB (1,000 requests): $0.00
- **Total: ~$0.12/month**

**Medium Traffic** (100,000 page views/month, 10,000 uploads/month):
- S3 Storage (100 GB): $2.30
- CloudFront (100 GB): $8.50
- API Gateway (100,000 requests): $0.10
- Lambda (100,000 invocations): $0.02
- DynamoDB (100,000 requests): $0.13
- **Total: ~$11/month**

**High Traffic** (1M page views/month, 100,000 uploads/month):
- S3 Storage (1 TB): $23.00
- CloudFront (1 TB): $85.00
- API Gateway (1M requests): $1.00
- Lambda (1M invocations): $0.20
- DynamoDB (1M requests): $1.30
- **Total: ~$110/month**

## Monitoring & Observability

### CloudWatch Logs
- All Lambda functions log to CloudWatch
- Log groups: `/aws/lambda/{function-name}`
- Retention: 7 days (default)

### CloudWatch Metrics
- Lambda: Invocations, Errors, Duration, Throttles
- API Gateway: Count, Latency, Errors
- CloudFront: Requests, Bytes Downloaded, Error Rate

### Recommended Alarms
1. Lambda error rate > 5%
2. API Gateway 5xx errors > 10
3. Estimated charges > budget threshold

## Infrastructure as Code

### Pulumi Structure
```
infra/
├── index.ts              # Main program
├── components/
│   ├── staticWebsite.ts  # S3 + CloudFront component
│   └── photoSharingBackend.ts  # Lambda + API Gateway + DynamoDB
└── Pulumi.*.yaml         # Stack configurations
```

### Deployment Strategy
1. Build all TypeScript projects
2. Package Lambda code as zip
3. Upload static assets to S3
4. Update CloudFront distributions
5. Create/update Lambda functions
6. Wire up API Gateway routes

### State Management
- Pulumi state stored in S3
- Encrypted at rest
- Versioned for rollback
- Shared across team members

## Future Enhancements

### Short Term
- Image thumbnails (Lambda + Sharp + S3)
- Album passwords (encrypted in DynamoDB)
- Download all as zip (Lambda + Archiver)

### Long Term
- User accounts (Cognito)
- Private albums with invites
- Comments on photos
- Search functionality (OpenSearch)
- Face detection (Rekognition)
- Video support (MediaConvert)
