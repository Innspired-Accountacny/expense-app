# Repository Guidelines

## Project Structure & Module Organization

- `index.html` / `vite.config.ts`: Vite entry + build/dev configuration.
- `src/main.tsx`: React bootstrap (mounts `App`).
- `src/App.tsx`: App shell (onboarding + tab navigation) and `localStorage` persistence.
- `src/components/`: Feature screens and shared components.
  - `src/components/ui/`: UI primitives (Radix/shadcn-style wrappers like `Button`, `Dialog`, `Tabs`).
- `src/utils/`: Business logic (e.g., `invoiceNumbering.ts`, `invoiceCalculations.ts`).
- `src/types/`: Shared TypeScript types.
- `src/index.css` / `src/styles/`: Global styles (Tailwind CSS + theme variables).

## Build, Test, and Development Commands

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the dev server (defaults to `http://localhost:3000` and auto-opens a browser).
- `pnpm build`: Create a production build in `build/`.

## Coding Style & Naming Conventions

- TypeScript + React function components; use PascalCase for components/files (e.g., `InvoicesScreen.tsx`).
- Match existing formatting: 2-space indentation, double quotes, semicolons.
- Prefer internal imports via `@/…` (`@` maps to `src/` in `vite.config.ts`).
- Reuse primitives in `src/components/ui/` before adding new UI patterns.
- Keep the version-suffixed import pattern (e.g., `@radix-ui/react-dialog@1.1.6`) aligned with `vite.config.ts` aliases when updating dependencies.

## Testing Guidelines

No automated test suite is configured yet. Validate changes by:

- Running `pnpm dev` and exercising onboarding + each bottom tab.
- Running `pnpm build` to ensure the production build succeeds.

## Commit & Pull Request Guidelines

- Current git history is a single bootstrap commit; use Conventional Commits going forward (e.g., `feat: add expense categories`, `fix: correct VAT rounding`).
- PRs should include a short summary, screenshots for UI changes (mobile viewport), and notes on any `localStorage` schema changes (include a reset/migration step if needed).

## Security & Configuration Tips

- Persistence is browser `localStorage`; never store secrets or real customer PII in the repo or seeded sample data.
- To reset app state during development, clear site data in the browser.
