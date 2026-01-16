# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm build                  # Build all packages
pnpm typecheck              # Run TypeScript type checking

# Linting & Formatting (Biome)
pnpm lint                   # Run Biome linter
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code
pnpm check                  # Run both lint and format checks
pnpm check:fix              # Fix lint and format issues

# FSD Architecture Lint (web app only)
pnpm --filter @connlytics/web lint    # Run steiger FSD linter

# Per-package commands
pnpm --filter @connlytics/web dev       # Web app dev server
pnpm --filter @connlytics/extension dev # Extension watch build
```

## Architecture

### Monorepo Structure (pnpm + Turborepo)

- `apps/web` - Next.js 16 web application (React 19, React Compiler, Tailwind 4)
- `packages/extension` - Chrome extension (Vite, content scripts for Connpass)
- `packages/shared` - Shared types and utilities

### Feature-Sliced Design (FSD)

The web app follows FSD architecture. Layers from top to bottom:

```
src/
  app/        # Next.js App Router pages (routing only, no logic)
  views/      # Page-level compositions (home, editor)
  widgets/    # Self-contained UI blocks (markdown-editor)
  features/   # User interactions (export-markdown, preview-markdown)
  entities/   # Business entities (event, markdown)
  shared/     # Reusable utilities, UI components, configs
```

Each slice exports through `index.ts`. Import only from public API (index files).

### Chrome Extension Structure

```
packages/extension/src/
  background/   # Service worker
  content/      # Content scripts (Connpass page integration)
  popup/        # Extension popup UI
  manifest.json # Extension manifest v3
```

## Code Style

- Biome for linting and formatting (single quotes, trailing commas, semicolons)
- TypeScript strict mode
- Steiger for FSD architecture validation
