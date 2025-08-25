# Setup Instructions

## Environment Setup for Publishing

To publish this package, you need to set up environment variables for authentication:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your NPM authentication token:
   - Go to https://www.npmjs.com/settings/tokens
   - Create a new "Automation" token (this bypasses OTP requirements)
   - Make sure to select "Automation" type, not "Publish" 
   - Copy the token value

3. Edit the `.env` file and replace `your_npm_token_here` with your actual NPM token:
   ```bash
   NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## Publishing

Once the `.env` file is set up, you can publish using:

```bash
# Patch release (1.0.0 -> 1.0.1)
pnpm release:patch

# Minor release (1.0.0 -> 1.1.0)  
pnpm release:minor

# Major release (1.0.0 -> 2.0.0)
pnpm release:major

# Dry run to test without publishing
pnpm release:dry
```

The release process will:
1. Run validation tests
2. Run lint checks with zero warnings
3. Bump the version number
4. Generate a changelog
5. Create a git tag
6. Publish to NPM
7. Create a GitHub release