# Release Process

This document outlines the steps for tagging and deploying a new version of the Battleship Web Game.

## 1. Versioning

We use [Semantic Versioning (SemVer)](https://semver.org/):
- **MAJOR**: Breaking changes (e.g., protocol rewrite).
- **MINOR**: New features (e.g., a new AI difficulty).
- **PATCH**: Bug fixes and performance improvements.

## 2. Release Steps

### Phase 1: Preparation
1. Ensure all features are merged into the `develop` branch.
2. Create a new `release/vX.Y.Z` branch from `develop`.
3. Update the `version` field in `package.json`.
4. Run a full suite of tests: `npm run test`.

### Phase 2: Documentation
1. Update `CHANGELOG.md` with a summary of changes.
2. Update any relevant sections in `docs/` if new features were added.

### Phase 3: Merging & Tagging
1. Merge the release branch into `main`.
2. Tag the commit on `main`:
   ```bash
   git tag -a vX.Y.Z -m "Release version X.Y.Z"
   git push origin main --tags
   ```
3. Merge `main` back into `develop` to ensure version parity.

## 3. Deployment

The deployment is handled automatically via GitHub Actions once a tag is pushed or a merge to `main` occurs:
- **Vercel**: Automatically picks up changes on `main` and deploys the frontend.
- **Railway**: Automatically redeploys the backend server on successful push to `main`.

## 4. Post-Release
1. Verify the production URL is functional.
2. Monitor error logs in Railway and Vercel for any immediate regressions.
