# Branching Strategy & Workflow

We use a modified version of **Git Flow** to manage features, fixes, and releases.

## 1. Permanent Branches

- **`main`**: Contains the most stable, production-ready code. Every commit here is automatically deployed to the production environment.
- **`develop`**: The primary integration branch. All new features and bug fixes are merged here first.

## 2. Temporary Branches

- **`feature/<name>`**: For new features. Branched from `develop`, merged back to `develop` via Pull Request.
- **`fix/<name>`**: For bug fixes. Branched from `develop`, merged back to `develop`.
- **`release/<version>`**: Preparation for a new production release. Branched from `develop`, merged into both `main` and `develop`.

## 3. Commit Guidelines

We follow **Conventional Commits**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests

## 4. Pull Request Process

1. **Review**: All PRs must be reviewed by at least one other team member.
2. **CI**: Tests, linting, and build checks must pass before merging.
3. **Squash**: We prefer squashing commits when merging to `develop` to keep a clean history.
