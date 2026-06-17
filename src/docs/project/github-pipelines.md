# GitHub pipelines

## Branch flow

- Feature work: `feat`
- Test branch: `dev`
- Current production branch: `main`
- Future production branch if created: `prod`
- Production domain: `https://khoobrooz.com`
- Suggested staging domain: `https://dev.khoobrooz.com`

## Pull requests

Create pull requests in this order:

1. `feat` -> `dev`
2. `dev` -> `main` or `prod`

The CI pipeline runs on pull requests to `dev`, `main`, and `prod`.

The pipeline resolves a branch environment:

| Branch/base | Environment | URL |
| --- | --- | --- |
| `feat` | feature | `http://localhost:3000` |
| `dev` | staging | `https://dev.khoobrooz.com` |
| `main` | production | `https://khoobrooz.com` |
| `prod` | production | `https://khoobrooz.com` |

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
