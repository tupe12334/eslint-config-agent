---
description: Stage, commit and push only relevant changes from the latest task
allowed-tools: Bash, Read, Glob, Grep
---

# Smart Commit and Push

Stage, commit, and push only the changes relevant to the latest task. Analyzes git status, recent changes, and active specifications to determine what should be committed.

## Current State

### Repository Status

- Current branch: !`git branch --show-current 2>/dev/null || echo "N/A"`
- Upstream status: !`git status -sb 2>/dev/null || echo "N/A"`
- Unstaged files: !`git status --short 2>/dev/null || echo "No changes"`
- Last commit: !`git log -1 --pretty=format:"%h - %s (%ar)" 2>/dev/null || echo "N/A"`

### Recent Changes

- Modified files: !`git status --porcelain 2>/dev/null | grep -E '^\s*M' || echo "None"`
- New files: !`git status --porcelain 2>/dev/null | grep -E '^\?\?' || echo "None"`
- Staged files: !`git status --porcelain 2>/dev/null | grep -E '^[MADRC]' || echo "None"`

### Active Context

- Active specs: !`ls -1 .kiro/specs/ 2>/dev/null || echo "No specs"`
- Recent spec changes: !`git status --porcelain .kiro/specs/ 2>/dev/null || echo "No spec changes"`
- Recent command changes: !`git status --porcelain .claude/commands/ 2>/dev/null || echo "No command changes"`

## Instructions

Follow these steps to intelligently commit and push only relevant changes:

### 1. Analyze the Context

**Identify the latest task** by examining:

- Active specifications in `.kiro/specs/`
- Recent changes in the working directory
- Last commit message for context
- Modified files to understand what was being worked on

**Determine change scope**:

- Are changes related to a specific feature/spec?
- Are they related to new commands or configuration?
- Are they bug fixes or refactoring?
- Are there any test files or documentation changes?

### 2. Filter Relevant Changes

**IMPORTANT**: Only stage files directly related to the latest task. Exclude:

- Unrelated files that may have been modified
- Debug or temporary files
- Configuration changes not part of the task
- Files from previous tasks not yet committed

**Group changes logically**:

- If working on a spec: stage spec-related files + implementation files
- If creating commands: stage command files + any related configs
- If fixing bugs: stage only affected source files + tests
- Keep commits focused and atomic

### 3. Stage Changes Selectively

Use `git add` with specific file paths, NOT `git add .` or `git add -A`:

```bash
# Example: Stage specific files
git add .kiro/specs/feature-name/
git add src/components/NewComponent.tsx
git add src/components/NewComponent.spec.tsx
```

**Verify staging**:

- Run `git status` to confirm only relevant files are staged
- Run `git diff --cached` to review what will be committed
- Double-check no sensitive or unintended files are included

### 4. Create Descriptive Commit Message

Generate a commit message that:

- Follows conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Clearly describes what changed and why
- References spec/feature name if applicable
- Includes co-author attribution:

```
feat(feature-name): add new component for user authentication

Implements the authentication flow as specified in .kiro/specs/auth-feature.
- Add login component
- Add authentication service
- Add tests for auth flow

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 5. Commit with Proper Message

Use heredoc for proper formatting:

```bash
git commit -m "$(cat <<'EOF'
feat(scope): description

Detailed explanation if needed.
- Point 1
- Point 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 6. Push to Remote

Before pushing:

- Verify you're on the correct branch
- Check if remote tracking branch exists
- Pull any remote changes if needed (with --rebase if appropriate)

Push command:

```bash
# If branch has upstream
git push

# If new branch without upstream
git push -u origin $(git branch --show-current)
```

### 7. Verify Success

After pushing:

- Confirm push was successful
- Show the commit hash and message
- Provide remote URL for the commit if available
- List what files were included in the commit

## Safety Checks

**MUST DO before committing**:

- [ ] Review all staged files with `git status`
- [ ] Check diff with `git diff --cached`
- [ ] Ensure no secrets or credentials are being committed
- [ ] Verify no `.env` or sensitive config files are staged
- [ ] Confirm changes are related to the current task only
- [ ] Test that code builds/runs if applicable

**DO NOT commit**:

- Files containing secrets, tokens, or credentials
- Large binary files unless intentional
- Generated files that should be gitignored
- Unrelated changes from other tasks
- Debug/temporary files

## Output Format

Provide clear output showing:

1. **Analysis**: What task was identified
2. **Files staged**: List of files being committed with reason
3. **Files excluded**: Any modified files not being committed and why
4. **Commit message**: The full message being used
5. **Push status**: Success/failure with details
6. **Next steps**: Any recommendations or follow-up actions

## Example Workflow

```bash
# 1. Analyze changes
git status
git diff --name-only

# 2. Stage relevant files
git add .claude/commands/utils/new-command.md
git add .claude/commands/utils/another-command.md

# 3. Verify staging
git status
git diff --cached --stat

# 4. Commit with message
git commit -m "$(cat <<'EOF'
feat(commands): add utility commands for enhanced workflow

Add two new commands:
- ultrathink: Deep analysis mode for continuing current task
- commit-push: Smart commit with relevance filtering

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# 5. Push to remote
git push
```

---

**Remember**: This command is about being smart and selective. Only commit what's directly related to the latest task. Keep commits clean, focused, and meaningful.
