# Contributing Guide

Thank you for your interest in contributing to this personal website platform!

## Getting Started

1. **Fork the repository** (if working with others)
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/personal-website.git
   cd personal-website
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your development environment** following the [Development Guide](./DEVELOPMENT.md)

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

Follow the existing code style and patterns:
- TypeScript for type safety
- Functional React components
- Async/await for promises
- Clear, descriptive variable names
- Comments for complex logic

### 3. Test Your Changes

**Frontend changes**:
```bash
# Run locally
npm run dev:landing
# or
npm run dev:photo

# Build to ensure no TypeScript errors
npm run build:landing
npm run build:photo-frontend
```

**Backend changes**:
```bash
# Build Lambda handlers
npm run build:backend

# Deploy to dev stack
cd infra
pulumi stack select dev
pulumi up

# Test via frontend or curl
curl https://your-api.com/albums
```

**Infrastructure changes**:
```bash
cd infra
pulumi preview  # Review changes
pulumi up       # Apply to dev stack
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add password protection for albums"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Screenshots (if UI changes)
- Steps to test

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface Album {
  id: string
  title: string
  createdAt: string
}

async function createAlbum(request: CreateAlbumRequest): Promise<Album> {
  // Implementation
}

// ❌ Bad
async function createAlbum(request: any): Promise<any> {
  // Implementation
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface AlbumCardProps {
  album: Album
  onDelete: (id: string) => void
}

function AlbumCard({ album, onDelete }: AlbumCardProps) {
  return (
    <div className="album-card">
      <h3>{album.title}</h3>
      <button onClick={() => onDelete(album.id)}>Delete</button>
    </div>
  )
}

// ❌ Bad - Class component, no types
class AlbumCard extends React.Component {
  render() {
    return <div>{this.props.album.title}</div>
  }
}
```

### Lambda Handlers

```typescript
// ✅ Good - Proper error handling and types
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const albumId = event.pathParameters?.albumId
    if (!albumId) {
      return error('Album ID required', 400)
    }

    const album = await getAlbum(albumId)
    return success(album)
  } catch (err) {
    console.error('Error:', err)
    return error('Failed to get album', 500)
  }
}

// ❌ Bad - No error handling, any types
export async function handler(event: any) {
  const album = await getAlbum(event.pathParameters.albumId)
  return { statusCode: 200, body: JSON.stringify(album) }
}
```

### Pulumi Components

```typescript
// ✅ Good - Typed props, parent resource
interface BackendArgs {
  environment: string
  lambdaCodePath: string
}

export class Backend extends pulumi.ComponentResource {
  constructor(name: string, args: BackendArgs, opts?: pulumi.ComponentResourceOptions) {
    super('custom:Backend', name, {}, opts)

    const bucket = new aws.s3.Bucket(
      `${name}-bucket`,
      { /* ... */ },
      { parent: this }
    )

    this.registerOutputs({ bucketName: bucket.id })
  }
}

// ❌ Bad - Untyped, no component resource
function createBackend(name: string, args: any) {
  return new aws.s3.Bucket(`${name}-bucket`)
}
```

## Testing Guidelines

### What to Test

**Frontend**:
- User interactions (form submissions, clicks)
- Error states
- Loading states
- Edge cases (empty lists, long text)

**Backend**:
- Valid requests return expected results
- Invalid requests return proper errors
- IAM permissions are correct
- S3 presigned URLs work

**Infrastructure**:
- All resources created successfully
- Outputs are correct
- IAM policies follow least privilege
- Cost optimization is maintained

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Landing page loads and displays apps
- [ ] Can create an album
- [ ] Can upload images to album
- [ ] Can view images in album
- [ ] Can share album URL
- [ ] Shared URL works in incognito mode
- [ ] Error messages display properly
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] CloudWatch logs show no errors

## Documentation Guidelines

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing APIs or interfaces
- Adding new configuration options
- Changing deployment process
- Adding new dependencies

### Documentation Files

- `README.md` - High-level overview
- `QUICKSTART.md` - Getting started guide
- `DEPLOYMENT.md` - Deployment instructions
- `DEVELOPMENT.md` - Development workflow
- `ARCHITECTURE.md` - System architecture
- `CONTRIBUTING.md` - This file

### Code Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use presigned URLs to avoid proxying large files through Lambda
// This reduces Lambda execution time and costs
const uploadUrl = await getSignedUrl(s3Client, command)

// ❌ Bad - Obvious from the code
// Get the signed URL
const uploadUrl = await getSignedUrl(s3Client, command)
```

## Cost Considerations

When adding features, consider AWS costs:

### Low-Cost Patterns ✅
- Use Lambda instead of EC2
- Use S3 presigned URLs (avoid Lambda data transfer)
- Use HTTP API instead of REST API
- Use on-demand DynamoDB
- Use CloudFront for caching
- Implement S3 lifecycle rules

### High-Cost Patterns ❌
- Proxying data through Lambda
- Using REST API Gateway
- Provisioned DynamoDB capacity
- No CloudFront caching
- Keeping all data in Standard storage

## Security Considerations

When adding features, consider security:

### Security Checklist

- [ ] No secrets in code (use environment variables)
- [ ] IAM roles follow least privilege
- [ ] S3 buckets are not public
- [ ] HTTPS everywhere
- [ ] Input validation on all endpoints
- [ ] Proper error messages (don't leak info)
- [ ] Rate limiting considered (if needed)
- [ ] CORS configured properly

### Common Security Issues

**❌ Bad - SQL injection vulnerability**:
```typescript
const query = `SELECT * FROM albums WHERE id = '${albumId}'`
```

**✅ Good - Parameterized query**:
```typescript
const album = await docClient.send(
  new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `ALBUM#${albumId}` }
  })
)
```

**❌ Bad - Public S3 bucket**:
```typescript
new aws.s3.Bucket('my-bucket', {
  acl: 'public-read'
})
```

**✅ Good - Private bucket with presigned URLs**:
```typescript
new aws.s3.Bucket('my-bucket', {})
new aws.s3.BucketPublicAccessBlock('block', {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true
})
```

## Pull Request Process

1. **Ensure your code builds**: `npm run build:all`
2. **Test thoroughly**: Follow the manual testing checklist
3. **Update documentation**: If adding features or changing behavior
4. **Write a clear PR description**:
   - What changed
   - Why it changed
   - How to test it
5. **Add screenshots**: If UI changes
6. **Keep PRs focused**: One feature/fix per PR
7. **Respond to feedback**: Address review comments promptly

## Questions?

If you have questions:
1. Check existing documentation
2. Review similar code in the project
3. Open a GitHub issue for discussion

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Give credit where credit is due
- Help others learn and grow

Thank you for contributing! 🎉
