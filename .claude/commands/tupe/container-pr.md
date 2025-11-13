---
description: Execute work in an isolated Docker container with gh and npm credentials, then automatically create a PR. Enables multiple agents to work concurrently without interference.
---

# Containerized Multi-Agent Workflow with Auto-PR

You are an expert containerized development workflow manager. Your mission is to execute all requested work inside an isolated Docker container and create a pull request when finished.

## Primary Use Case: Concurrent Multi-Agent Development

This command enables **multiple Claude agents to work simultaneously** on different tasks by providing complete isolation:

- **Run multiple agents in parallel**: Each agent works in its own isolated container
- **Zero interference**: Agents don't conflict with each other or the host system
- **Clean environments**: Each agent starts with a pristine development environment
- **Independent PRs**: Each agent creates its own pull request for review
- **Efficient workflows**: No waiting for one agent to finish before starting another

### Example Multi-Agent Scenario

```text
Agent 1 (/tupe:container-pr): Adding user authentication
  ├─ Container: node:20-bullseye
  ├─ Branch: claude/auth-implementation-20251111-0001
  └─ PR: https://github.com/user/repo/pull/123

Agent 2 (/tupe:container-pr): Updating dependencies
  ├─ Container: node:20-bullseye
  ├─ Branch: claude/deps-update-20251111-0002
  └─ PR: https://github.com/user/repo/pull/124

Agent 3 (/tupe:container-pr): Optimizing database queries
  ├─ Container: python:3.11-bullseye
  ├─ Branch: claude/db-optimization-20251111-0003
  └─ PR: https://github.com/user/repo/pull/125

All running concurrently without conflicts!
```

## Overview

This command creates an isolated development environment where:
1. All work happens inside a Docker container (complete isolation)
2. GitHub and npm credentials are securely passed through
3. Changes are committed and pushed to a new branch
4. A pull request is automatically created
5. The PR URL is returned to the user
6. Multiple instances can run in parallel for concurrent agent workflows

## Phase 1: Environment Setup and Validation

### Step 1: Verify Prerequisites

Check that all required tools are available:

```bash
# Check Docker
docker --version

# Check if Docker daemon is running
docker ps

# Check GitHub CLI
gh --version

# Check gh authentication
gh auth status

# Check npm authentication (if needed)
npm whoami 2>/dev/null || echo "npm not authenticated (may not be needed)"

# Get current repository info
git remote -v
git branch --show-current
```

**Validation**:
- ✅ Docker is installed and running
- ✅ GitHub CLI is installed and authenticated
- ✅ Repository has a remote origin
- ⚠️ npm authentication is optional (only needed if publishing)

If any critical prerequisite fails, inform the user and stop.

### Step 2: Capture User Credentials

Securely capture credentials for container use:

```bash
# Get GitHub token
GH_TOKEN=$(gh auth token)

# Get npm token if authenticated
NPM_TOKEN=$(npm token list 2>/dev/null | grep "readonly" | head -1 | awk '{print $1}' || echo "")

# Get current user info
GH_USER=$(gh api user --jq .login)

# Get git config
GIT_USER_NAME=$(git config user.name)
GIT_USER_EMAIL=$(git config user.email)

# Store for container use
echo "✅ Captured credentials for user: $GH_USER"
```

**Security Note**: These tokens will only be passed to the container via environment variables, never written to disk.

### Step 3: Repository Analysis

Understand the current state:

```bash
# Check for uncommitted changes
git status --porcelain

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if branch is up to date with remote
git fetch origin
git status

# Get repository name
REPO_NAME=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

echo "Repository: $REPO_NAME"
echo "Current branch: $CURRENT_BRANCH"
```

**Important**: If there are uncommitted changes, ask the user:
- Should they be included in the containerized work?
- Should they be stashed first?
- Should the command abort?

## Phase 2: Container Preparation

### Step 1: Determine Base Image

Choose the appropriate base image based on the project:

```bash
# Check project type
if [ -f "package.json" ]; then
  NODE_VERSION=$(cat package.json | grep '"node"' | grep -o '[0-9]*' | head -1)
  if [ -z "$NODE_VERSION" ]; then
    NODE_VERSION=20
  fi
  BASE_IMAGE="node:${NODE_VERSION}-bullseye"
  echo "📦 Using Node.js base image: $BASE_IMAGE"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  BASE_IMAGE="python:3.11-bullseye"
  echo "🐍 Using Python base image: $BASE_IMAGE"
elif [ -f "go.mod" ]; then
  BASE_IMAGE="golang:1.21-bullseye"
  echo "🐹 Using Go base image: $BASE_IMAGE"
else
  BASE_IMAGE="ubuntu:22.04"
  echo "🐧 Using Ubuntu base image: $BASE_IMAGE"
fi
```

### Step 2: Create Dockerfile

Generate a Dockerfile for the containerized environment:

```dockerfile
# Write to .claude-container/Dockerfile
FROM ${BASE_IMAGE}

# Install essential tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Set up git config (will be overridden by env vars)
RUN git config --global --add safe.directory /workspace

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]
```

```bash
# Create directory for container artifacts
mkdir -p .claude-container

# Write Dockerfile
cat > .claude-container/Dockerfile << 'EOF'
[Dockerfile content from above]
EOF

echo "✅ Dockerfile created at .claude-container/Dockerfile"
```

### Step 3: Build Container Image

```bash
# Build the image
docker build -t claude-workspace:latest .claude-container/

echo "✅ Container image built: claude-workspace:latest"
```

## Phase 3: Execute Work in Container

### Step 1: Create New Branch

```bash
# Generate branch name based on task
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TASK_SLUG=$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]' '-' | cut -c1-40)
NEW_BRANCH="claude/containerized-work-${TIMESTAMP}"

# Create and checkout new branch
git checkout -b "$NEW_BRANCH"

echo "✅ Created new branch: $NEW_BRANCH"
```

### Step 2: Start Container with Mounted Repository

```bash
# Start container with all necessary configurations
docker run -it \
  --name claude-work-${TIMESTAMP} \
  --rm \
  -v "$(pwd):/workspace" \
  -e GH_TOKEN="${GH_TOKEN}" \
  -e NPM_TOKEN="${NPM_TOKEN}" \
  -e GIT_USER_NAME="${GIT_USER_NAME}" \
  -e GIT_USER_EMAIL="${GIT_USER_EMAIL}" \
  -w /workspace \
  claude-workspace:latest \
  /bin/bash -c '
    # Configure git inside container
    git config --global user.name "$GIT_USER_NAME"
    git config --global user.email "$GIT_USER_EMAIL"

    # Authenticate gh
    echo "$GH_TOKEN" | gh auth login --with-token

    # Configure npm if token exists
    if [ -n "$NPM_TOKEN" ]; then
      echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
    fi

    # Now execute the actual work
    # [WORK COMMANDS GO HERE]
  '
```

**IMPORTANT**: For the actual implementation, you will NOT run an interactive container. Instead, you will:
1. Execute each command/operation individually via `docker run`
2. Each command mounts the same volume
3. This allows you to see output and control execution

### Step 3: Execute Work Commands

For each operation the user requests, run it in the container:

```bash
# Example: Install dependencies
docker run --rm \
  -v "$(pwd):/workspace" \
  -w /workspace \
  claude-workspace:latest \
  /bin/bash -c 'npm install'

# Example: Run tests
docker run --rm \
  -v "$(pwd):/workspace" \
  -w /workspace \
  claude-workspace:latest \
  /bin/bash -c 'npm test'

# Example: Build project
docker run --rm \
  -v "$(pwd):/workspace" \
  -w /workspace \
  claude-workspace:latest \
  /bin/bash -c 'npm run build'

# For each command:
# 1. Run in container
# 2. Check exit code
# 3. Show output to user
# 4. Handle errors appropriately
```

**Work Execution Strategy**:
- Use the TodoWrite tool to track each step of the requested work
- Execute each step in the container using `docker run`
- Verify each step succeeded before proceeding
- If a step fails, analyze the error and retry or inform the user

## Phase 4: Commit and Push Changes

### Step 1: Review Changes

```bash
# Check what changed (outside container, using host git)
git status
git diff
git diff --stat

# List all changed files
git status --porcelain
```

Show the user a summary of changes and ask for confirmation if needed.

### Step 2: Commit Changes

```bash
# Stage all changes
git add -A

# Create comprehensive commit message
COMMIT_MSG="feat: containerized work - ${TASK_DESCRIPTION}

All work executed in isolated Docker container:
- Base image: ${BASE_IMAGE}
- Container: claude-workspace:latest

Changes:
$(git diff --cached --stat)

🤖 Generated with Claude Code - Container Workflow
Co-Authored-By: Claude <noreply@anthropic.com>"

# Commit
git commit -m "$COMMIT_MSG"

echo "✅ Changes committed"
```

### Step 3: Push to Remote

```bash
# Push new branch to remote
git push -u origin "$NEW_BRANCH"

echo "✅ Branch pushed to remote: $NEW_BRANCH"
```

## Phase 5: Create Pull Request

### Step 1: Generate PR Description

Create a comprehensive PR description:

```markdown
## Summary

[Brief description of what was accomplished]

## Work Environment

All changes were made in an isolated Docker container to ensure reproducibility:

- **Base Image**: `${BASE_IMAGE}`
- **Container**: `claude-workspace:latest`
- **Credentials**: GitHub CLI and npm (if needed)

## Changes Made

[Bullet list of key changes]

## Testing

- [ ] All tests pass
- [ ] Build succeeds
- [ ] No linting errors
- [ ] Changes verified in container

## Implementation Details

<details>
<summary>Container Configuration</summary>

\`\`\`bash
# Dockerfile used
[Show Dockerfile content]
\`\`\`

</details>

<details>
<summary>Commands Executed</summary>

\`\`\`bash
[List all commands executed in container]
\`\`\`

</details>

---

🤖 Generated with [Claude Code](https://claude.com/claude-code) - Container Workflow

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Step 2: Create the PR

```bash
# Determine base branch (usually main or master)
BASE_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)

# Create PR using gh
PR_URL=$(gh pr create \
  --base "$BASE_BRANCH" \
  --head "$NEW_BRANCH" \
  --title "Containerized Work: ${TASK_DESCRIPTION}" \
  --body "$(cat <<'EOF'
[Generated PR description from above]
EOF
)")

echo "✅ Pull Request Created: $PR_URL"
```

### Step 3: Add Labels and Metadata

```bash
# Add relevant labels
gh pr edit "$PR_URL" --add-label "automated,containerized,claude-code"

# Add reviewers if specified
if [ -n "$REVIEWERS" ]; then
  gh pr edit "$PR_URL" --add-reviewer "$REVIEWERS"
fi

# Add assignee (the current user)
gh pr edit "$PR_URL" --add-assignee "@me"
```

## Phase 6: Cleanup and Summary

### Step 1: Cleanup Container Artifacts

```bash
# Remove container Dockerfile directory
rm -rf .claude-container/

# Clean up any Docker images if requested
# docker rmi claude-workspace:latest

echo "✅ Cleanup complete"
```

### Step 2: Return to Original Branch

```bash
# Switch back to original branch
git checkout "$CURRENT_BRANCH"

echo "✅ Returned to branch: $CURRENT_BRANCH"
```

### Step 3: Final Summary

Provide a comprehensive summary to the user:

```
✅ Containerized Workflow Complete!

📋 Summary:
- Branch: ${NEW_BRANCH}
- Base Image: ${BASE_IMAGE}
- Commits: [number of commits]
- Files Changed: [number of files]
- Pull Request: ${PR_URL}

🔗 Next Steps:
1. Review the PR: ${PR_URL}
2. Request reviews from team members
3. Monitor CI/CD checks
4. Merge when ready

💡 The new branch is still available if you need to make changes:
   git checkout ${NEW_BRANCH}
```

## Usage Examples

### Example 0: Multi-Agent Concurrent Workflow (PRIMARY USE CASE)

This is the **key benefit** of using containers: running multiple agents simultaneously!

```
Developer opens 3 Claude Code sessions and starts 3 agents in parallel:

┌─ Session 1 ─────────────────────────────────────┐
│ User: /tupe:container-pr                        │
│ User: "Add user authentication with JWT"        │
│                                                  │
│ Agent 1:                                         │
│ ✅ Container: node:20-bullseye                  │
│ ✅ Branch: claude/auth-jwt-20251111-0001        │
│ ⚙️  Installing passport, jsonwebtoken...        │
│ ⚙️  Creating auth middleware...                 │
│ ⚙️  Adding login/register routes...             │
│ ✅ Tests passing in container                   │
│ ✅ PR created: https://github.com/.../pull/123  │
└──────────────────────────────────────────────────┘

┌─ Session 2 ─────────────────────────────────────┐
│ User: /tupe:container-pr                        │
│ User: "Update all dependencies to latest"       │
│                                                  │
│ Agent 2:                                         │
│ ✅ Container: node:20-bullseye                  │
│ ✅ Branch: claude/deps-update-20251111-0002     │
│ ⚙️  Running npm update...                       │
│ ⚙️  Checking for breaking changes...            │
│ ⚙️  Running tests...                            │
│ ✅ All tests passing                            │
│ ✅ PR created: https://github.com/.../pull/124  │
└──────────────────────────────────────────────────┘

┌─ Session 3 ─────────────────────────────────────┐
│ User: /tupe:container-pr                        │
│ User: "Optimize database queries with indexes"  │
│                                                  │
│ Agent 3:                                         │
│ ✅ Container: python:3.11-bullseye              │
│ ✅ Branch: claude/db-indexes-20251111-0003      │
│ ⚙️  Analyzing query patterns...                 │
│ ⚙️  Adding database indexes...                  │
│ ⚙️  Running migration tests...                  │
│ ✅ Performance improved 3x                      │
│ ✅ PR created: https://github.com/.../pull/125  │
└──────────────────────────────────────────────────┘

🎉 Result: 3 PRs created in parallel!
   - No conflicts between agents
   - Each in clean, isolated environment
   - All working concurrently
   - Developer reviews 3 PRs simultaneously
```

**Why This Works**:

- Each agent runs in its own isolated Docker container
- Containers don't interfere with each other
- Each creates its own branch (different timestamps)
- Git operations are isolated per branch
- Host system remains clean
- Credentials safely shared across all containers

**Time Savings**:

- Sequential (one agent at a time): ~45 minutes (3 × 15 min)
- Parallel (three agents): ~15 minutes (max of all tasks)
- **3x faster development!**

### Example 1: Simple Feature Implementation

```
User: "Add a health check endpoint"

Agent:
1. Sets up container with Node.js
2. Creates health-check endpoint in src/routes/health.ts
3. Adds tests
4. Runs tests in container
5. Commits and creates PR
6. Returns: https://github.com/user/repo/pull/123
```

### Example 2: Dependency Update

```
User: "Update all dependencies to latest"

Agent:
1. Sets up container
2. Runs npm update in container
3. Runs tests in container
4. Commits updated package.json and lock file
5. Creates PR with dependency changes
6. Returns: https://github.com/user/repo/pull/124
```

## Error Handling

### Docker Not Available

```
❌ Docker is not installed or not running.

Please install Docker:
- macOS: https://docs.docker.com/desktop/install/mac-install/
- Linux: https://docs.docker.com/engine/install/
- Windows: https://docs.docker.com/desktop/install/windows-install/

Then ensure the Docker daemon is running:
docker ps
```

### GitHub CLI Not Authenticated

```
❌ GitHub CLI is not authenticated.

Please authenticate:
gh auth login

Then try again.
```

### Container Build Fails

```
❌ Failed to build container image.

Error: [show error]

Troubleshooting:
1. Check Docker daemon is running
2. Verify base image is available
3. Check network connectivity
4. Try building manually: docker build -t claude-workspace:latest .claude-container/
```

### Work Command Fails in Container

```
❌ Command failed in container: [command]

Exit code: [code]
Output: [show output]

Options:
1. Fix the error and retry
2. Skip this step (if non-critical)
3. Abort the workflow
```

## Important Notes

### Security Considerations

1. **Credentials**: GitHub and npm tokens are passed as environment variables, never written to files
2. **Isolation**: Container provides isolation from host system
3. **Cleanup**: Tokens only exist during container runtime
4. **Volume Mounts**: Only current repository is mounted, not entire home directory

### Limitations

1. **Interactive Operations**: Commands requiring user input need special handling
2. **GUI Applications**: Not supported in container
3. **System-Level Changes**: Limited to what Docker allows
4. **Performance**: May be slower than native execution

### Best Practices

1. **Small Changes**: Best for focused, well-defined tasks
2. **Testing**: Always run tests in container before committing
3. **Branch Names**: Use descriptive branch names
4. **PR Descriptions**: Include all relevant context
5. **Cleanup**: Always clean up container artifacts

## Advanced Configuration

### Custom Dockerfile

If the user needs specific tools or configuration:

```dockerfile
FROM node:20-bullseye

# Custom tool installations
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Custom environment variables
ENV CUSTOM_VAR=value

WORKDIR /workspace
```

### Pre-configured Images

For faster execution, consider using pre-built images:

```bash
# Instead of building each time, use a pre-configured image
docker pull ghcr.io/user/claude-workspace:latest

# Or build once and reuse
docker build -t claude-workspace:local .claude-container/
```

### Multiple Services

If work requires multiple services (database, redis, etc.):

```bash
# Use docker-compose
cat > .claude-container/docker-compose.yml << 'EOF'
version: '3.8'
services:
  workspace:
    build: .
    volumes:
      - .:/workspace
    environment:
      - GH_TOKEN=${GH_TOKEN}
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=dev
EOF

# Run work with docker-compose
docker-compose -f .claude-container/docker-compose.yml run workspace [command]
```

## Success Criteria

You have completed the containerized workflow when:

1. ✅ Docker container successfully created
2. ✅ All credentials properly configured
3. ✅ All requested work completed in container
4. ✅ All tests pass in container
5. ✅ Changes committed to new branch
6. ✅ Branch pushed to remote
7. ✅ Pull request created successfully
8. ✅ PR URL provided to user
9. ✅ Container artifacts cleaned up
10. ✅ Original branch restored

---

**Now begin the containerized development workflow!**
