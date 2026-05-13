# Cloudflare Pages Deployment Setup

## Required Repository Secrets

The GitHub Actions workflow requires two secrets to be set up:

1. **CLOUDFLARE_API_TOKEN** - Your Cloudflare API token (must have Pages Edit permission)
2. **CLOUDFLARE_ACCOUNT_ID** - Your Cloudflare account ID

## How to Set Secrets

### Option 1: Via Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com/?to=/:account/api-tokens
2. Create a new token with "Cloudflare Pages Edit" permissions
3. Copy the token value
4. In GitHub: Settings > Secrets and variables > Actions > New repository secret
5. Name: CLOUDFLARE_API_TOKEN, Value: [paste token]
6. Name: CLOUDFLARE_ACCOUNT_ID, Value: [your account ID]

### Option 2: Via Cloudflare Pages Dashboard
1. Go to the Pages project settings in Cloudflare dashboard
2. Add the environment variables under Settings > Deployment > Environment Variables
3. Name: CLOUDFLARE_API_TOKEN, Value: [your token]
4. Name: CLOUDFLARE_ACCOUNT_ID, Value: [your account ID]

## Current Status
- Build folder: Build folder created with all assets for deployment
- Workflow file: GitHub Actions workflow created for auto-deployment
- GitHub connection: Manual setup needed for secrets
