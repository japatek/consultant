# JaPa2 Data Structure Overview

This document explains the data architecture of the project from the perspective of the application layer in `src/` and the database layer in `prisma/`. It is meant to help a developer understand not only where files live, but also what each important file is responsible for.

---

## 1. Architectural idea

This project is structured around a typical modern Next.js + Prisma application:

- `src/app/` = route-level UI and API entrypoints
- `src/components/` = reusable UI building blocks
- `src/lib/` = shared logic and service-layer utilities
- `src/stores/` = client state and application preferences
- `src/server/` = server-side actions and secure logic
- `src/types/` = validation schemas and TypeScript contract types
- `prisma/` = database schema and persistence contract

In other words:

- The UI renders data from `src/app` and `src/components`
- The business rules live in `src/lib` or `src/server`
- The data structure is validated in `src/types`
- The actual database is defined in `prisma/schema.prisma`

---

## 2. Project folder map

```text
JaPa2/
├── src/
│   ├── app/                    # Next.js pages, layouts, route groups, API routes
│   ├── components/             # Shared components (UI, AI, email templates, logo)
│   ├── config/                 # Application config constants
│   ├── data/                   # Static/mock data used by UI or seed data
│   ├── generated/              # Prisma-generated client code
│   ├── hooks/                  # React hooks for browser behavior
│   ├── lib/                    # Core utilities, auth logic, database, cert logic
│   ├── navigation/             # Navigation button/sidebar config helpers
│   ├── proxy.ts                # Proxy-related helper file
│   ├── scripts/                # Theme boot and preset generation scripts
│   ├── server/                 # Server actions
│   ├── stores/                 # Zustand stores for state management
│   ├── styles/                 # Styling assets and theme presets
│   ├── translate/              # Language translation data
│   ├── types/                  # TypeScript + Zod definitions
│   └── ...
├── prisma/
│   ├── schema.prisma           # Main database schema
│   ├── seed.ts                 # Database seed logic
│   ├── data/
│   │   └── tools.csv           # Static content source
│   └── ...
├── package.json
├── README.md
├── docker-compose.yaml
├── Dockerfile
├── PROJECT_STRUCTURE.md
└── DATA_STRUCTURE.md
```

---

## 3. Deep explanation of the `src/` folder

### 3.1 `src/app/`
This is the highest-level route layer of the app. In Next.js App Router, `app/` controls pages, layouts, route groups, loading states, error boundaries, and API endpoints.

This project uses route groups and nested folders such as:

- `(external)` for public marketing pages
- `(main)` for authenticated or internal app pages
- `api/` for backend endpoints
- `_test/` for sandbox/test pages

Core responsibilities:

- define the page trees visible to users
- compose page layouts from smaller components
- route authentication and authorization behavior
- provide API endpoints for actions like checkout, Midtrans callback, user verification, and auth

A few important files:

- `src/app/layout.tsx`  
  This is the root layout. It configures the global HTML document, loads the theme preferences from cookies, sets dark/light mode attributes, injects the theme boot script, wraps children in `PreferencesStoreProvider`, and provides the global `SessionProvider`. This file is effectively the app shell.

- `src/app/page.tsx`  
  This is the root landing page. It checks whether a `verified_human` cookie exists. If not, it renders a Turnstile challenge screen; if yes, it renders the public landing page with `Navbar`, `Hero`, `FeaturedProjects`, `CTA`, `OurClients`, and `Footer`.

- `src/app/error.tsx`  
  Global error boundary UI for unexpected client-side or route-level errors.

- `src/app/loading.tsx`  
  Shared spinner/loading page while data or route content is being prepared.

- `src/app/not-found.tsx`  
  Custom 404 page.

#### `src/app/api/`
This directory contains all backend API handlers.

Examples in this project:

- `auth/[...nextauth]/route.ts`  
  Auth.js route for sign-in, sign-out, session handling, and JWT authentication.

- `checkout/route.ts`  
  Handles checkout request flow for payment or product fulfillment.

- `midtrans/route.ts` and `midtrans/upload/route.ts`  
  Support payment callbacks, verification, and upload-related processing.

- `verify-license/route.ts`  
  Validates a license or entitlement before access is granted.

- `transcribe/route.ts` or `_transcribe/route.ts`  
  API endpoints for audio transcription or media processing tasks.

- `user/.../route.ts`  
  User profile updates, email change flows, and verification logic.

This folder is where Next.js surfaces backend functionality without creating a separate API server.

---

### 3.2 `src/components/`
This folder contains reusable UI components that are not specific to one route. It is the visual building block library of the app.

Main categories:

- `ui/` = shared design-system components (buttons, inputs, cards, dropdowns, tables, dialogs, etc.)
- `ai/` = components for AI assistant panels, file trees, chat messages, artifacts, tool cards, etc.
- `verify-email/` = email verification UI states and animations
- `template-email/` = HTML/email template components used for password resets or account emails
- `logo/` = brand/logo components

Important files:

- `src/components/Footer.tsx`  
  Global footer component for page layout.

- `src/components/simple-icon.tsx`  
  Lightweight wrapper for icon rendering used throughout the UI.

- `src/components/date-range-picker.tsx`  
  Date range selection component for dashboard/reporting flows.

- `src/components/ui/button.tsx`  
  Core reusable button primitive used across the app.

- `src/components/ui/card.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `table.tsx`, `sidebar.tsx`  
  UI primitives built for the app's design system.

- `src/components/ai/terminal.tsx`  
  Special component for a terminal-style AI output or command interface.

- `src/components/ai/conversation.tsx`  
  Chat conversation UI and message list.

- `src/components/ai/file-tree.tsx`  
  Displays project/file structure in a chat environment.

- `src/components/ai/artifact.tsx`  
  Presents model-generated artifacts or code snippets in a reusable card-like block.

- `src/components/template-email/VerificationEmail.tsx`  
  Generates the email template used for user email verification.

The reason this folder is important is that it keeps the app reusable and consistent: routes import small components instead of embedding all UI logic directly in the page.

---

### 3.3 `src/lib/`
This is the backbone of the project. It contains the logic that is shared across pages and routes, including utilities, auth helpers, database access, and content transformation.

#### `src/lib/database/`
- `prisma.ts`  
  Creates and exports the Prisma client singleton instance. It uses PostgreSQL pooling and caches the client in development to avoid recreating it on hot reload.

#### `src/lib/auth/`
This folder holds authentication-related logic.

- `auth.ts`  
  Main Auth.js v5 configuration. It sets up providers (Google, email magic link), Prisma adapter, custom cookies, JWT session logic, and callback handling. This is one of the most important files in the project.

- `auth-admin.ts`  
  Likely contains admin-specific authorization checks and access-control helpers.

- `email.ts`  
  Sends email verification and auth-email payloads.

- `use-profile-cache.ts`  
  Helps manage or cache user profile state in the client side of auth interactions.

#### `src/lib/certificate/`
This area deals with certification eligibility and awarding logic.

- `check-eligibility.ts`  
  Evaluates whether a user satisfies the conditions for a certification.

- `certification-actions.ts`  
  Performs actions related to certification creation, update, or validation.

#### `src/lib/preferences/`
This is likely the theme and personalization logic layer.

Examples include:

- `preferences-config.ts`  
  Stores default preference values and persistence behavior.

- `theme.ts`  
  Defines accepted theme mode and related values.

- `layout.ts` and `layout-utils.ts`  
  Manage layout preferences, such as sidebar or content layout settings.

- `preferences-storage.ts`  
  Reads and writes saved user preferences.

This package is what makes the app remember user theme, font, sidebar layout, and style state.

#### `src/lib/utils/`
A general-purpose helper area.

- `utils.ts`  
  Generic helper functions used across the app.

- `audio.ts`  
  Audio-related helper logic, likely used with recording or playback functions.

#### Root-level files in `src/lib/`
- `audio-utils.ts`  
  Utility functions around audio generation, recording, or media processing.

- `cookie.client.ts`  
  Client-side cookie access helper.

- `local-storage.client.ts`  
  Local storage helper for browser-only persistence.

- `json.ts`  
  Generic JSON serialization or parsing utilities.

- `proxy-helper.ts`  
  Proxy-related helper used to support auth or external request patterns.

- `utils.ts`  
  A shared utility module for everyday helper functions.

- `fonts/registry.ts`  
  Registers and configures custom fonts for the app.

This is the folder where a lot of app-wide logic lives and where many cross-cutting concerns are centralized.

---

### 3.4 `src/stores/`
This folder contains global client-side state. The project uses Zustand for state management.

Important files:

- `src/stores/accountStore.ts`  
  Stores the list of user accounts in browser localStorage and exposes methods like `upsertAccount`, `removeAccount`, and `getActiveAccount`. This is useful for switching between multiple account identities or cached JWT-based sessions.

- `src/stores/preferences/preferences-provider.tsx`  
  React provider that exposes the current preference state to the application.

- `src/stores/preferences/preferences-store.ts`  
  Central store that tracks user preferences such as theme mode, preset, layout style, and sidebar settings.

These stores are the main bridge between browser state and UI rendering.

---

### 3.5 `src/server/`
This layer is for server-only operations that cannot live in a client component.

- `src/server/server-actions.ts`  
  Contains server actions for reading and writing cookies, retrieving user preference values, and storing secure server-side state. These functions are meant to be called from server components or server actions, not regular client-side UI code.

This folder is important because it separates secure or server-side logic from UI concerns.

---

### 3.6 `src/types/`
This folder defines the data contracts used across the app. This is where the project describes what valid data looks like.

- `src/types/quest.ts`  
  This is a very important file because it defines the quest domain in a structured way. It contains:

  - `DIFFICULTIES`, `CATEGORIES`, `ANSWER_TYPES`, `MEDIA_TYPES`
  - `zod` schemas for answer configuration
  - `multipleChoiceConfigSchema`
  - `textInputConfigSchema`
  - `fileUploadConfigSchema`
  - `answerConfigSchema`
  - `questFormSchema`
  - `submittedAnswerSchema`

  In plain terms, this file describes the shape of a quest, the allowed question types, and the format of a submitted answer. It acts as validation logic that helps both the admin form and the backend grader agree on the same structure.

- `src/types/next-auth.d.ts`  
  Augments the default types for Auth.js so that the project can safely add custom fields to `session.user` and related objects.

This folder is one of the most important “contract” zones of the codebase.

---

### 3.7 `src/data/`
This folder holds static or seed-like data used during development or UI rendering.

- `src/data/test-data.ts`  
  Provides mock or testing data for UI development and prototyping.

- `src/data/users.ts`  
  Contains user records used in static/local examples or development stubs.

This folder exists to support demos, placeholders, and non-DB data scenarios.

---

### 3.8 `src/hooks/`
This folder contains React hooks for reusable browser behavior.

- `use-audio-recording.ts`  
  Wraps the audio recording flow for capturing microphone input.

- `use-auto-scroll.ts`  
  Auto-scrolls a container as new content appears.

- `use-autosize-textarea.ts`  
  Expands a textarea automatically based on content length.

- `use-copy-to-clipboard.ts`  
  Copies text to the clipboard and manages copy state.

- `use-language.ts`  
  Reads the current language from cookies / custom events and returns translation data.

- `use-mobile.ts`  
  Detects if the current viewport is mobile-sized.

These hooks reduce repeated logic across the app and are especially helpful in UI-heavy or dashboard-like sections.

---

### 3.9 `src/scripts/`
This folder contains small bootstrapping scripts that execute at app startup or generate assets.

- `theme-boot.tsx`  
  Generates a script that runs before the page paints to restore theme preferences from cookies/localStorage and apply them to the document.

- `generate-theme-presets.ts`  
  Produces static theme preset output for the UI.

This is not business logic in the usual sense; it is more of an initialization layer for styling and runtime preferences.

---

### 3.10 `src/config/`
- `app-config.ts`  
  Contains app metadata, versioning, and branding values used across the app shell.

This file is important because many page titles, metadata descriptions, and the global app name come from here.

---

### 3.11 `src/translate/`
- `language-data.ts`  
  Stores the actual translation strings and language definitions used by the app.

This is the data source for language switching and localization.

---

### 3.12 `src/navigation/`
This folder contains navigation UI helpers.

- `button/`  
  Buttons or actions tied to section navigation or page logic.

- `sidebar/`  
  Sidebar definition items, section mappings, and navigation metadata used by the dashboard or app shell.

This helps keep main navigation logic separate from page content.

---

### 3.13 `src/styles/`
Contains CSS theme presets, visual assets, or flags used by styling.

This folder is generally used for visual identity, not business logic.

---

### 3.14 `src/generated/`
This folder is generated by Prisma and contains the Prisma client code for the project.

It is not manually hand-written, and it should not be edited directly unless you are regenerating Prisma client output.

---

## 4. Core file-by-file summary

Below is a practical summary of the most important TypeScript/TSX files you will likely read first when working in this codebase:

| File | Purpose |
| --- | --- |
| `src/app/layout.tsx` | App shell; global preferences, theme boot, session provider |
| `src/app/page.tsx` | Root landing page and access gate |
| `src/server/server-actions.ts` | Server cookie helpers and preference access |
| `src/lib/database/prisma.ts` | Prisma singleton configuration |
| `src/lib/auth/auth.ts` | Auth.js setup, providers, JWT/session callbacks |
| `src/stores/accountStore.ts` | Multi-account browser state |
| `src/stores/preferences/preferences-store.ts` | Theme/layout preference state |
| `src/types/quest.ts` | Quest validation schema and answer config types |
| `src/config/app-config.ts` | App metadata and branding constants |
| `src/scripts/theme-boot.tsx` | Theme initialization script |
| `src/hooks/use-language.ts` | Translation hook |
| `src/data/test-data.ts` | Static mock data |
| `src/data/users.ts` | Local user data |
| `src/translate/language-data.ts` | Translation strings |

---

## 5. How data flows through the project

A normal request or page flow usually looks like this:

1. A page in `src/app/` is requested.
2. The page may read cookies, preferences, auth state, or DB data.
3. The page composes UI from components in `src/components/`.
4. Helper logic in `src/lib/` or `src/server/` prepares business data or handles secure logic.
5. Client-side state may come from `src/stores/`.
6. Persistent data is stored according to Prisma models in `prisma/schema.prisma`.

Example: quest handling

- The admin form lives in a route under `src/app/`
- Validation and shapes are defined in `src/types/quest.ts`
- The UI is built using reusable components
- Data is saved through Prisma models such as `Quest`, `QuestMedia`, and `QuestCompletion`
- The app reads and renders the results from the DB layer via Prisma or server actions

---

## 6. Relationship to the Prisma schema

The main database layer is in `prisma/schema.prisma`.

This file defines the actual tables and relationships for:

- users and authentication
- tools and licenses
- articles and content
- quest definitions and submissions
- media attachments for quests

This means:

- `src/types` defines what data should look like at the application level
- `prisma/schema.prisma` defines what data can actually be persisted in the database

These two layers must stay aligned.

---

## 7. The practical mental model

A developer working in this codebase should think in these layers:

1. Route layer: `src/app/`
2. View layer: `src/components/`
3. State layer: `src/stores/`
4. Business logic layer: `src/lib/`, `src/server/`
5. Contract/validation layer: `src/types/`
6. Persistence layer: `prisma/`

If you want to understand any feature, the correct pattern is:

- Start from the page or route in `src/app/`
- Check which components it uses
- Follow any helper functions in `src/lib/` or `src/server/`
- Confirm the data contract in `src/types/`
- Confirm the DB model in `prisma/schema.prisma`

---

## 8. Short summary

The `src/` folder is the full application layer of JaPa2. It is organized into route pages, reusable UI, state, configuration, auth, utilities, and validation. The code is built so that the UI remains clean while core responsibilities are split between:

- `app/` for route entrypoints
- `components/` for UI composition
- `lib/` for shared logic
- `stores/` for application state
- `types/` for data contracts
- `prisma/` for database models

This separation is what makes the system scalable and maintainable.
