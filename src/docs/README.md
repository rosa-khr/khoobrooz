# Khoobrooz

Professional Next.js website for Khoobrooz Trade.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- React

## Project Structure

Most project code and project documentation lives inside `src`, similar to a clean Angular-style layout:

```text
src/
  app/                 Next.js routes and pages
  core/
    lib/               core site constants and helpers
  shared/
    components/        reusable UI components
  data/                navigation and content data
  assets/
    images/            project-owned image assets
  docs/
    project/           agents, skills, plans, and archived prototype
```

Root files such as `package.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, and `next-env.d.ts` stay at the root because Next.js, npm, TypeScript, and Tailwind expect them there.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

Main local URL:

```text
http://localhost:3000/fa
```
