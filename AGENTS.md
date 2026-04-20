<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Development Setup

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run production**: `npm run start`
- **Lint code**: `npm run lint`
- Set `NEXT_PUBLIC_API_BASE_URL` environment variable for API calls.

## Project Conventions

- **Language**: JavaScript only (no TypeScript).
- **Styling**: Tailwind CSS with shadcn/ui components. Use `cn()` utility from `src/lib/utils.js` for class merging.
- **Components**: Feature-based organization (e.g., `src/components/billing/`). Reusable UI in `src/components/ui/`.
- **API**: Axios client in `src/lib/api/client.js` with auth and caching. Use mocks in `src/lib/mock/` for development.
- **Forms**: React Hook Form + Zod for validation.
- **Animations**: Framer Motion for UI effects.

## Architecture

- Next.js App Router (`src/app/`).
- Client-side rendering with API integration.
- No global state management; local state per component.
- Experimental: React Compiler enabled for performance.

## Common Pitfalls

- API calls fail without `NEXT_PUBLIC_API_BASE_URL`.
- Aggressive caching may show stale data; refresh manually.
- Experimental features (React Compiler, Tailwind v4) may cause issues.
- No automated tests; validate manually.
- Auth tokens stored in localStorage (XSS risk).

See [README.md](README.md) for basic setup. For billing implementation details, refer to backend documentation.

## Development Setup

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run production**: `npm run start`
- **Lint code**: `npm run lint`
- Set `NEXT_PUBLIC_API_BASE_URL` environment variable for API calls.

## Project Conventions

- **Language**: JavaScript only (no TypeScript).
- **Styling**: Tailwind CSS with shadcn/ui components. Use `cn()` utility from `src/lib/utils.js` for class merging.
- **Components**: Feature-based organization (e.g., `src/components/billing/`). Reusable UI in `src/components/ui/`.
- **API**: Axios client in `src/lib/api/client.js` with auth and caching. Use mocks in `src/lib/mock/` for development.
- **Forms**: React Hook Form + Zod for validation.
- **Animations**: Framer Motion for UI effects.

## Architecture

- Next.js App Router (`src/app/`).
- Client-side rendering with API integration.
- No global state management; local state per component.
- Experimental: React Compiler enabled for performance.

## Common Pitfalls

- API calls fail without `NEXT_PUBLIC_API_BASE_URL`.
- Aggressive caching may show stale data; refresh manually.
- Experimental features (React Compiler, Tailwind v4) may cause issues.
- No automated tests; validate manually.
- Auth tokens stored in localStorage (XSS risk).

See [README.md](README.md) for basic setup. For billing implementation details, refer to backend documentation.
