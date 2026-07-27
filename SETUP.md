# Setup Instructions

## Publishing

This package is published to npm exclusively through GitHub Actions CI/CD — there is no local `.env` file or manual publish step (see [RELEASING.md](./RELEASING.md) for the full process):

- **Automatic**: Pushing to `main` triggers a patch release
- **Manual**: Run the "CI/CD" workflow from the Actions tab, choosing `patch`, `minor`, or `major`

Publishing uses npm's OIDC trusted publishing (`npm publish --provenance`), so no `NPM_TOKEN` secret is required. The workflow only needs the GitHub-provided `GITHUB_TOKEN`.

To exercise the `release-it` flow locally without publishing:

```bash
pnpm exec release-it --dry-run
```

The release process will:

1. Run validation tests
2. Run lint checks with zero warnings
3. Bump the version number
4. Generate a changelog
5. Create a git tag
6. Publish to NPM
7. Create a GitHub release
