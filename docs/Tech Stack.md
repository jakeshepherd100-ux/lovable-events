# Tech Stack

## Runtime & Framework

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.6 | React meta-framework — routing, SSR, image optimization |
| React | 19.2.3 | UI library |
| React DOM | 19.2.3 | DOM rendering |

## Styling

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | ^4 | Utility-first CSS |
| @tailwindcss/postcss | ^4 | PostCSS integration for Tailwind v4 |

## Language & Tooling

| Package | Version | Purpose |
|---------|---------|---------|
| TypeScript | ^5 | Static types — strict mode enabled |
| ESLint | ^9 | Linting |
| eslint-config-next | 16.1.6 | Next.js lint rules (core-web-vitals + TS) |

## TypeScript Config Highlights

- **Target**: ES2017
- **Libs**: DOM, DOM.Iterable, ESNext
- **Module resolution**: Bundler
- **Path alias**: `@/*` → `./*` (relative to `apps/web/`)
- **Strict mode**: on
- **JSX**: preserve (handled by Next.js)

## Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config (minimal/default) |
| `tsconfig.json` | TypeScript compiler options |
| `postcss.config.mjs` | PostCSS for Tailwind v4 |
| `eslint.config.mjs` | ESLint flat config |
