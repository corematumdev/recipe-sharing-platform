# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Production server**: `npm run start` - Runs production server (requires build first)
- **Linting**: `npm run lint` - Runs ESLint with Next.js configuration

## Project Architecture

This is a Next.js 15 application with TypeScript and Tailwind CSS, structured for a recipe sharing platform.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans and Geist Mono (via next/font)

### Project Structure
- Uses Next.js App Router (`app/` directory)
- TypeScript path aliases configured (`@/*` maps to root)
- ESLint configured with Next.js and TypeScript rules
- Tailwind CSS with PostCSS integration

### Key Configuration
- **TypeScript**: Strict mode, ES2017 target, bundler module resolution
- **ESLint**: Extends `next/core-web-vitals` and `next/typescript`
- **Path Aliases**: `@/*` resolves to project root for cleaner imports