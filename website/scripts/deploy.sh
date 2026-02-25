#!/bin/bash
set -e

echo "🚀 Deploying Personal Website Platform"
echo ""

# Get stack name
STACK=${1:-dev}
echo "📦 Stack: $STACK"
echo ""

# Build all projects
echo "🔨 Building projects..."
echo ""

# Build shared types
echo "Building shared types..."
cd packages/shared-types
npm run build
cd ../..

# Build backend
echo "Building backend..."
cd apps/photo-sharing/backend
npm run build
cd ../../..

# Build frontends
echo "Building landing page..."
cd apps/landing
npm run build
cd ../..

echo "Building photo sharing frontend..."
cd apps/photo-sharing/frontend
npm run build
cd ../../..

echo ""
echo "✅ All projects built successfully"
echo ""

# Deploy infrastructure
echo "🏗️  Deploying infrastructure to AWS..."
cd infra
pulumi stack select $STACK
pulumi up

cd ..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "To view stack outputs:"
echo "  cd infra && pulumi stack output"
