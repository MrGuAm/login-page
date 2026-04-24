# Champion Login Page

An animated Next.js login page for Champion's Blog. The interface pairs a clean password form with playful character animations, dark mode support, and a simple password gate powered by an environment variable.

## Features

- Animated characters that react to pointer movement and password input
- Light and dark theme support
- Password-only login flow
- Cookie-based authenticated state
- Responsive layout for desktop and mobile
- Built with Next.js, React, Tailwind CSS, Base UI, shadcn/ui, and lucide-react

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Base UI
- shadcn/ui
- lucide-react

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file named `.env.local`:

```bash
NEXT_PUBLIC_PASSWORD=your-password
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Authentication Flow

The login form compares the entered password with `NEXT_PUBLIC_PASSWORD`. When the password matches, the app writes an `authenticated=true` cookie and redirects to `/write`.

## Project Structure

```text
src/app/layout.tsx       App metadata and global layout
src/app/page.tsx         Animated login page
src/app/globals.css      Tailwind theme and global styles
src/components/ui        Reusable UI components
src/lib/utils.ts         Utility helpers
```

## Deployment

The project can be deployed to Vercel or any platform that supports Next.js. Add `NEXT_PUBLIC_PASSWORD` to the deployment environment variables before publishing.
