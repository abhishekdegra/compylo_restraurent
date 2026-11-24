# COMPYLO Restaurant

A premium, cinematic fine-dining website built for COMPYLO. The experience combines an ancient-palace entrance, responsive storytelling, a living banyan-and-serpent scroll animation, curated menus, gallery, reservations, and contact flows.

## Highlights

- Fully responsive desktop, tablet, and mobile layouts
- Cinematic palace-gate intro with animated birds
- Circadian dawn, day, dusk, and noir themes
- Canvas-based banyan tree and serpent scroll experience
- Route-level code splitting and responsive image delivery
- Smooth desktop scrolling with native mobile touch behavior
- Accessible reduced-motion support
- Menu, gallery, story, reservation, and contact routes
- Vercel-ready SPA routing and production cache headers

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lenis smooth scrolling
- HTML Canvas
- Oxlint

## Local development

Requirements: Node.js 20.19 or newer and npm.

```bash
git clone https://github.com/abhishekdegra/compylo_restraurent.git
cd compylo_restraurent
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, create the local environment file with:

```powershell
Copy-Item .env.example .env
```

## Environment variables

All browser-exposed Vite variables intentionally use the `VITE_` prefix. Do not place private API keys or server secrets in these values.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_NAME` | Restaurant display name |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code, digits only |
| `VITE_CONTACT_PHONE` | Human-readable phone number |
| `VITE_CONTACT_PHONE_TEL` | Phone value used by `tel:` links |
| `VITE_CONTACT_EMAIL` | Public concierge email |

Safe placeholder values are provided in `.env.example`. The real `.env` file is ignored by Git. Configure production values in Vercel under **Project Settings -> Environment Variables**.

## Quality checks

```bash
npm run lint
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy to Vercel

1. Import this GitHub repository in Vercel.
2. Vercel will detect the Vite framework settings from `vercel.json`.
3. Add the variables from `.env.example` in the Vercel project settings.
4. Deploy. Future pushes to `main` will trigger new deployments automatically.

The included rewrite keeps React Router routes working when a page is refreshed directly.

## Security notes

- `.env`, local credentials, certificates, build output, and Vercel local state are excluded from Git.
- Public contact values are centralized in `src/config/site.ts`.
- Security headers are configured for Vercel and static-hosting fallbacks.

## License

Private project. All rights reserved by COMPYLO Restaurant.
