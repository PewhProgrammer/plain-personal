# Development Guide

This guide covers local development workflows, testing, and debugging.

## Development Setup

### Initial Setup

1. **Clone and install**:
   ```bash
   cd /Users/thinhtran/personal/website
   npm install
   ```

2. **Build shared types** (needed by all other packages):
   ```bash
   npm run build:shared
   ```

3. **Deploy backend to AWS** (needed for frontend development):
   ```bash
   npm run deploy:dev
   ```

Note: The backend must run on AWS (Lambda + API Gateway). There's no local backend server.

## Project Structure

```
personal-website/
├── apps/
│   ├── landing/                  # Landing page app
│   │   ├── src/
│   │   │   ├── App.tsx          # Main component
│   │   │   ├── main.tsx         # Entry point
│   │   │   └── index.css        # Styles
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── photo-sharing/
│       ├── frontend/            # Photo sharing frontend
│       │   ├── src/
│       │   │   ├── components/  # React components
│       │   │   ├── api/         # API client
│       │   │   ├── App.tsx
│       │   │   └── main.tsx
│       │   └── vite.config.ts
│       │
│       └── backend/             # Lambda handlers
│           ├── src/
│           │   ├── utils/       # Shared utilities
│           │   ├── createAlbum.ts
│           │   ├── getAlbum.ts
│           │   ├── getUploadUrl.ts
│           │   ├── getDownloadUrl.ts
│           │   └── listImages.ts
│           └── package.json
│
├── packages/
│   └── shared-types/            # TypeScript types
│       └── src/
│           └── index.ts         # Type definitions
│
├── infra/                       # Pulumi infrastructure
│   ├── components/              # Reusable components
│   │   ├── staticWebsite.ts
│   │   └── photoSharingBackend.ts
│   └── index.ts                 # Main program
│
└── scripts/                     # Build and deploy scripts
```

## Local Development

### Running the Landing Page

```bash
# Start dev server on http://localhost:5173
npm run dev:landing

# Or manually:
cd apps/landing
npm run dev
```

This runs Vite dev server with hot reload. Changes to React components automatically refresh.

### Running the Photo Sharing App

The photo sharing app needs the API URL from your deployed backend:

```bash
# Get your API URL
cd infra
pulumi stack output photoApiUrl

# Set environment variable and run
cd ..
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com npm run dev:photo
```

Or manually:

```bash
cd apps/photo-sharing/frontend
VITE_API_BASE_URL=https://... npm run dev
```

### Configuring Environment Variables

Create `.env.local` files in each frontend app directory:

**apps/landing/.env.local**:
```bash
VITE_PHOTO_SHARING_URL=http://localhost:5174
```

**apps/photo-sharing/frontend/.env.local**:
```bash
VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com
```

These files are git-ignored and won't be committed.

## Backend Development

### Modifying Lambda Functions

1. **Edit the handler**:
   ```bash
   # Example: edit createAlbum handler
   code apps/photo-sharing/backend/src/createAlbum.ts
   ```

2. **Build**:
   ```bash
   npm run build:backend
   ```

3. **Deploy**:
   ```bash
   cd infra
   pulumi up
   ```

4. **Test**:
   - Use the frontend
   - Or use curl:
     ```bash
     curl -X POST https://your-api.com/albums \
       -H "Content-Type: application/json" \
       -d '{"title": "Test Album"}'
     ```

### Testing Lambda Functions Locally

Lambda functions can't easily run locally because they depend on AWS services (DynamoDB, S3). However, you can:

1. **Unit test the logic**:
   ```typescript
   // Test the pure business logic
   import { handler } from './createAlbum'

   // Mock AWS SDK calls
   ```

2. **Use AWS SAM CLI** (optional):
   ```bash
   # Install SAM CLI
   brew install aws-sam-cli

   # Invoke locally with SAM
   sam local invoke CreateAlbumFunction
   ```

3. **Deploy to dev stack** and test there (recommended approach)

### Viewing Lambda Logs

```bash
# View logs for a specific function
aws logs tail /aws/lambda/photo-backend-createAlbum-dev --follow

# Or use Pulumi to get the function name
cd infra
pulumi stack output | grep Function
```

## Infrastructure Development

### Modifying Pulumi Code

1. **Edit infrastructure**:
   ```bash
   code infra/components/photoSharingBackend.ts
   ```

2. **Preview changes**:
   ```bash
   cd infra
   pulumi preview
   ```

3. **Apply changes**:
   ```bash
   pulumi up
   ```

### Adding a New Lambda Function

1. **Create the handler** in `apps/photo-sharing/backend/src/`:
   ```typescript
   // apps/photo-sharing/backend/src/deleteAlbum.ts
   import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
   import { success, error } from './utils/response'

   export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
     // Implementation
     return success({ message: 'Album deleted' })
   }
   ```

2. **Add to Pulumi code** in `infra/components/photoSharingBackend.ts`:
   ```typescript
   const deleteAlbumLambda = this.createLambdaFunction(
     `${name}-deleteAlbum`,
     args.lambdaCodePath,
     'deleteAlbum.handler',
     lambdaRole.arn,
     lambdaEnvironment,
     defaultResourceOptions
   )

   this.createRoute(
     `${name}-deleteAlbum`,
     this.api,
     'DELETE',
     '/albums/{albumId}',
     deleteAlbumLambda,
     defaultResourceOptions
   )
   ```

3. **Build and deploy**:
   ```bash
   npm run build:backend
   cd infra && pulumi up
   ```

### Adding a New Frontend Component

1. **Create component** in `apps/photo-sharing/frontend/src/components/`:
   ```typescript
   // AlbumList.tsx
   import React from 'react'

   interface AlbumListProps {
     albums: Album[]
   }

   function AlbumList({ albums }: AlbumListProps) {
     return (
       <div className="album-list">
         {albums.map(album => (
           <div key={album.id}>{album.title}</div>
         ))}
       </div>
     )
   }

   export default AlbumList
   ```

2. **Use in parent component**:
   ```typescript
   import AlbumList from './components/AlbumList'
   ```

3. **Test locally**:
   ```bash
   npm run dev:photo
   ```

4. **Deploy**:
   ```bash
   npm run build:photo-frontend
   cd infra && pulumi up
   ```

## Testing

### Manual Testing

**Frontend**:
- Use browser dev tools
- Test in Chrome, Safari, Firefox
- Test mobile responsive design

**Backend**:
- Use the frontend to exercise endpoints
- Use curl or Postman for API testing
- Check CloudWatch logs for errors

### Testing the Full Flow

1. **Create an album**:
   ```bash
   curl -X POST https://your-api.com/albums \
     -H "Content-Type: application/json" \
     -d '{"title": "Test", "description": "Testing"}' \
     | jq .
   ```

2. **Get album details**:
   ```bash
   curl https://your-api.com/albums/{albumId} | jq .
   ```

3. **Get upload URL**:
   ```bash
   curl -X POST https://your-api.com/albums/{albumId}/upload-url \
     -H "Content-Type: application/json" \
     -d '{"fileName": "test.jpg", "contentType": "image/jpeg"}' \
     | jq .
   ```

4. **Upload file**:
   ```bash
   curl -X PUT "{uploadUrl}" \
     -H "Content-Type: image/jpeg" \
     --data-binary @test.jpg
   ```

5. **Get download URL**:
   ```bash
   curl https://your-api.com/albums/{albumId}/download-url/{imageId} | jq .
   ```

## Debugging

### Frontend Debugging

**Browser DevTools**:
- Open DevTools (F12 or Cmd+Option+I)
- Check Console for errors
- Use Network tab to inspect API calls
- Use React DevTools extension

**Common Issues**:
- **CORS errors**: Check API Gateway CORS configuration
- **404 on refresh**: CloudFront/S3 should serve index.html for all routes
- **Environment variables**: Check `import.meta.env.VITE_*` values

### Backend Debugging

**CloudWatch Logs**:
```bash
# Tail logs for a function
aws logs tail /aws/lambda/photo-backend-createAlbum-dev --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/photo-backend-createAlbum-dev \
  --filter-pattern "ERROR"
```

**Add logging to Lambda**:
```typescript
export async function handler(event: APIGatewayProxyEventV2) {
  console.log('Event:', JSON.stringify(event, null, 2))
  console.log('Path params:', event.pathParameters)
  console.log('Body:', event.body)

  // ... rest of handler
}
```

**Common Issues**:
- **Function timeout**: Increase timeout in Pulumi code
- **Permission denied**: Check IAM role policy
- **Module not found**: Rebuild and redeploy
- **DynamoDB item not found**: Check table key schema

### Infrastructure Debugging

**Pulumi state issues**:
```bash
cd infra

# Refresh state from AWS
pulumi refresh

# View current state
pulumi stack export

# Cancel an in-progress update
pulumi cancel

# Destroy and recreate a specific resource
pulumi up --target urn:pulumi:dev::personal-website::...
```

**CloudFormation Console**:
- Pulumi uses CloudFormation under the hood
- Check AWS Console → CloudFormation for stack events
- Look for creation/update failures

## Performance Optimization

### Frontend Optimization

**Code splitting**:
```typescript
// Use React.lazy for code splitting
const Album = React.lazy(() => import('./components/Album'))

<Suspense fallback={<div>Loading...</div>}>
  <Album />
</Suspense>
```

**Image optimization**:
- Use WebP format when possible
- Serve multiple sizes
- Lazy load images below the fold

**Caching**:
- CloudFront automatically caches assets
- Set proper Cache-Control headers

### Backend Optimization

**Lambda cold starts**:
- Keep functions warm with CloudWatch Events (optional)
- Minimize dependencies
- Use Lambda layers for shared code (advanced)

**DynamoDB**:
- Use batch operations when possible
- Design efficient key schema
- Add GSIs only when needed

**S3 presigned URLs**:
- Cache presigned URLs (valid for 1 hour)
- Don't generate new URL on every request

## Git Workflow

**Branching**:
```bash
# Feature branch
git checkout -b feature/album-passwords

# Make changes
git add .
git commit -m "Add password protection for albums"

# Push and create PR
git push origin feature/album-passwords
```

**Deployment workflow**:
1. Develop on feature branch
2. Test with dev stack
3. Merge to main
4. Deploy to production

## Environment Management

### Multiple Stacks

```bash
cd infra

# List stacks
pulumi stack ls

# Create new stack
pulumi stack init staging
pulumi config set aws:region us-east-1
pulumi config set website:environment staging

# Switch between stacks
pulumi stack select dev
pulumi stack select staging
pulumi stack select prod

# Deploy to current stack
pulumi up
```

### Stack-Specific Configuration

Each stack can have different:
- AWS regions
- Resource names
- Configuration values
- Custom domains

**Example**:
- dev: Low-cost, single region
- staging: Production-like, testing ground
- prod: Multi-region, high availability

## Useful Commands

```bash
# Root level
npm install              # Install all dependencies
npm run build:all        # Build everything
npm run deploy:dev       # Deploy to dev
npm run outputs          # View stack outputs
npm run clean            # Clean build artifacts

# Frontend development
npm run dev:landing      # Run landing page locally
npm run dev:photo        # Run photo app locally

# Backend development
npm run build:backend    # Build Lambda handlers
aws logs tail /aws/lambda/... --follow  # View logs

# Infrastructure
cd infra
pulumi preview           # Preview changes
pulumi up                # Apply changes
pulumi destroy           # Delete everything
pulumi refresh           # Sync state with AWS
pulumi stack output      # View outputs
```

## Tips & Best Practices

1. **Always preview before deploying**: `pulumi preview`
2. **Test in dev before prod**: Use separate stacks
3. **Keep Lambda functions small**: Single responsibility
4. **Use TypeScript**: Catch errors at compile time
5. **Monitor CloudWatch logs**: Catch issues early
6. **Set up billing alerts**: Avoid surprise charges
7. **Version your state**: S3 versioning is enabled
8. **Tag resources**: Environment, project, owner
9. **Use presigned URLs**: Don't proxy data through Lambda
10. **Cache aggressively**: Use CloudFront cache headers
