# Project Structure

## SYSTEM PROMPT
Follow these rules when documenting the project structure:
1. Always create the project structure until the deepest directory/folder that exist.
2. Always include routing tools from Next.js to define folder names, such as [slug], [...slug], [[...slug]], @folder-name, and group (foldername).
3. For files with extensions *.tsx and *.ts, always include them in the folder structure documentation.

## Root

```text
next-shadcn-token-api-dashboard/
├── components.json
├── docker-compose.yaml
├── eslint.config.mjs
├── globalsv1.css
├── LICENSE
├── lmarkdown.md
├── PROJECT_STRUCTURE.md
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── schema.json
├── skills-lock.json
├── tsconfig.json
├── tsconfig.scripts.json
├── a/
│   └── npm.sh
├── aws/
│   └── ses-smtp-user.JaPaTek2026-07-24_credentials.csv
├── database/
│   ├── package.json
│   ├── prisma.config.ts
│   ├── schema.prisma
│   ├── migrations/
│   │   ├── 20260531184455_move_to_linux/
│   │   │   └── migration.sql
│   │   ├── 20260621020657_v5_auth/
│   │   │   └── migration.sql
│   │   └── 20260624124408_changes_email/
│   │       └── migration.sql
│   └── scripts/
│       ├── clear-db.ts
│       ├── dev-admin.js
│       ├── dev-extension-key.ts
│       ├── gen-license-keypair.ts
│       ├── init-db.ts
│       ├── reset-db.ts
│       └── reset-seed-db.ts
├── DOCUMENT/
│   ├── NOTE_2026-06-24.excalidraw
│   └── NOTE_2026-06-26.excalidraw
├── media/
└── src/
    ├── app/
    │   ├── (external)/
    │   │   ├── auth/
    │   │   │   └── v4/
    │   │   │       ├── _components/
    │   │   │       ├── docs/
    │   │   │       └── login/
    │   │   └── landing/
    │   │       ├── _components/
    │   │       │   ├── CTA.tsx
    │   │       │   ├── client.tsx
    │   │       │   ├── featured-projects.tsx
    │   │       │   ├── hero.tsx
    │   │       │   ├── nav-bar.tsx
    │   │       │   ├── sectors.tsx
    │   │       │   ├── services.tsx
    │   │       │   └── JaPaTek.tsx
    │   │       ├── industries/
    │   │       ├── loading.tsx
    │   │       ├── page.tsx
    │   │       ├── project/
    │   │       ├── sector/
    │   │       └── services/
    │   ├── (main)/
    │   │   └── dashboard/
    │   │       ├── (legacy)/
    │   │       │   ├── analytics-v1/
    │   │       │   ├── crm-v1/
    │   │       │   ├── default-v1/
    │   │       │   └── finance-v1/
    │   │       ├── [...not-found]/
    │   │       ├── academy/
    │   │       ├── account/
    │   │       ├── agents/
    │   │       ├── analytics/
    │   │       ├── api-keys/
    │   │       ├── build/
    │   │       ├── coming-soon/
    │   │       ├── control/
    │   │       ├── crm/
    │   │       ├── default/
    │   │       ├── ecommerce/
    │   │       ├── finance/
    │   │       ├── layout.tsx
    │   │       ├── logistics/
    │   │       ├── mail/
    │   │       ├── page.tsx
    │   │       ├── platchat/
    │   │       │   └── [id]/
    │   │       ├── platcrafting/
    │   │       ├── platoverview/
    │   │       ├── platresearch/
    │   │       ├── productivity/
    │   │       ├── research/
    │   │       ├── roles/
    │   │       ├── settings/
    │   │       ├── usage/
    │   │       └── users/
    │   ├── api/
    │   │   ├── auth/
    │   │   │   └── [...nextauth]/
    │   │   │       └── route.ts
    │   │   ├── chat/
    │   │   │   ├── WEBSITE/
    │   │   │   └── route.ts
    │   │   ├── transcribe/
    │   │   │   └── route.ts
    │   │   └── user/
    │   │       ├── change-email/
    │   │       ├── update-profile/
    │   │       └── verify-email-change/
    │   ├── globals.css
    │   ├── global-error.tsx
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   └── test/
    │       └── _backend/
    ├── components/
    │   ├── Background.tsx
    │   ├── Footer.tsx
    │   ├── SessionSync.tsx
    │   ├── Welcome.tsx
    │   ├── ai/
    │   ├── captcha/
    │   ├── logo/
    │   ├── template-email/
    │   └── ui/
    ├── config/
    │   └── app-config.ts
    ├── data/
    │   ├── test-data.ts
    │   └── users.ts
    ├── hooks/
    │   ├── use-audio-recording.ts
    │   ├── use-auto-scroll.ts
    │   ├── use-autosize-textarea.ts
    │   ├── use-copy-to-clipboard.ts
    │   └── use-mobile.ts
    ├── lib/
    │   ├── audio-utils.ts
    │   ├── cookie.client.ts
    │   ├── local-storage.client.ts
    │   ├── extension-key.ts
    │   ├── proxy-helper.ts
    │   ├── utils.ts
    │   ├── agents/
    │   ├── auth/
    │   ├── cart/
    │   ├── database/
    │   ├── fonts/
    │   ├── preferences/
    │   └── utils/
    ├── navigation/
    │   ├── button/
    │   └── sidebar/
    ├── server/
    │   └── server-actions.ts
    ├── stores/
    │   ├── accountStore.ts
    │   └── preferences/
    ├── styles/
    │   ├── flag-icons/
    │   └── presets/
    └── types/
        └── next-auth.d.ts
```

## Main Source Folders

- `src/app` - App routes, layouts, and page components
- `src/components` - Reusable UI components
- `src/lib` - Shared utilities and helper modules
- `src/server` - Server-side actions
- `src/stores` - Client state stores
- `src/styles` - Global styling assets and presets
- `database` - Prisma schema, migrations, and database scripts

## App Route Structure

```text
src/app/
├── (external)/
│   ├── auth/v4/
│   │   ├── _components/
│   │   ├── docs/
│   │   └── login/
│   └── landing/
│       ├── _components/
│       ├── industries/
│       ├── loading.tsx
│       ├── page.tsx
│       ├── project/
│       ├── sector/
│       └── services/
├── (main)/
│   └── dashboard/
│       ├── (legacy)/
│       ├── [...not-found]/
│       ├── academy/
│       ├── account/
│       ├── agents/
│       ├── analytics/
│       ├── api-keys/
│       ├── build/
│       ├── coming-soon/
│       ├── control/
│       ├── crm/
│       ├── default/
│       ├── ecommerce/
│       ├── finance/
│       ├── logistics/
│       ├── mail/
│       ├── page.tsx
│       ├── platchat/[id]/
│       ├── platcrafting/
│       ├── platoverview/
│       ├── platresearch/
│       ├── productivity/
│       ├── research/
│       ├── roles/
│       ├── settings/
│       ├── usage/
│       └── users/
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── chat/route.ts
│   ├── transcribe/route.ts
│   └── user/
└── test/
```
