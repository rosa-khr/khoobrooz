# GitHub pipelines

## Branch flow

- Feature work: `feat`
- Test branch: `dev`
- Production branch: `main`
- If a remote `prod` branch is created later, the pipeline already supports it.

## Pull requests

Create pull requests in this order:

1. `feat` -> `dev`
2. `dev` -> `main` or `prod`

The CI pipeline runs on pull requests to `dev`, `main`, and `prod`.

## Checks

The pipeline runs:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
docker build
```

## Recommended GitHub branch protection

In GitHub repository settings, protect `dev` and the production branch:

- Require a pull request before merging.
- Require status checks to pass before merging.
- Select the required checks:
  - `Typecheck, lint and build`
  - `Docker build`
- Do not allow direct pushes to the production branch.

## Deployment

Deployment is intentionally not automated yet because server access, domain, and secrets are not configured. After the server is ready, add deploy secrets and a production deploy workflow.
