# QAI Institute

Trilingual (EN/KZ/RU) digital archive of Kazakh architectural identity. Next.js 14 (App Router) + Decap CMS + Cloudinary + Mapbox GL JS + Netlify.

## Commands
- `npm run dev`: Local dev server (localhost:3000)
- `npm run build`: Production build
- `npx next lint`: Lint
- `npx decap-server`: Local CMS proxy (localhost:8081) for testing CMS without deploy

## Architecture
- `src/app/[locale]/` — locale-routed pages (en, kz, ru)
- `src/app/[locale]/(sections)/` — section pages: buildings, research, gallery, history, future, news, about
- `src/components/` — shared React components
- `src/lib/` — utilities, Cloudinary helpers, Mapbox config, i18n
- `content/` — CMS-managed Markdown/JSON content files (committed to git)
- `public/admin/` — Decap CMS admin interface (config.yml lives here)
- `netlify/functions/` — serverless functions (news scraper)
- `messages/` — i18n translation files (en.json, kz.json, ru.json) for UI strings

## Stack Details
- **CMS**: Decap CMS (formerly Netlify CMS). Config at `public/admin/config.yml`. All content stored as Markdown/JSON in `content/` directory, committed to git via Decap's GitHub/Git Gateway backend.
- **i18n**: next-intl for UI translations. Content trilingual — every CMS entry has `title_en`, `title_kz`, `title_ru` (and same pattern for all text fields). Locale detected from URL path prefix (`/en/`, `/kz/`, `/ru/`).
- **Images**: Cloudinary. Use next-cloudinary package. All CMS image fields store Cloudinary public IDs, not raw URLs. Configure Cloudinary media library widget in Decap CMS.
- **Maps**: Mapbox GL JS via react-map-gl. Access token from env var `NEXT_PUBLIC_MAPBOX_TOKEN`.
- **News scraping**: Netlify Scheduled Function. Uses Anthropic Claude API (`ANTHROPIC_API_KEY` env var) to summarize scraped articles. Runs daily. Sources: ArchDaily, Dezeen, Architectural Review, The Architect's Newspaper, vlast.kz. Filter: Kazakhstan/Central Asia architecture only.
- **Hosting**: Netlify. Deploy via git push to main branch. Decap CMS uses Netlify Identity + Git Gateway for auth.

## Design System
- **Aesthetic**: Editorial/academic architecture studio. References: Acme, AA School, i-MAD, Faulkner Browns, WW+P. Clean white backgrounds, strong typography, editorial grid layouts, full-bleed imagery, minimal ornamentation.
- **Palette**: Monochrome (white `#FFFFFF`, off-white `#F5F5F3`, black `#1A1A1A`, greys) + deep teal accent `#1A5C5A`. Use teal sparingly — links, active states, key UI highlights, hover accents.
- **Typography**: Use a distinctive serif for headings (e.g., Playfair Display, DM Serif Display, or similar editorial serif available on Google Fonts — NOT generic sans-serif). Clean sans-serif for body (e.g., Libre Franklin, Source Sans 3). The logo uses a classical serif — headings should complement it.
- **Logo**: The QAI Institute logo features geometric interlocking diamond/cross ornamental pattern inspired by traditional Kazakh motifs. The logo file is swappable — store in `public/logo.png` and reference via a config constant so it can be changed without code edits. Use the geometric pattern from the logo as a subtle decorative motif throughout the site (section dividers, background textures, footer ornament).
- **Layout**: Generous whitespace. Asymmetric editorial grids for content sections. Full-bleed hero images. Magazine-style image placements in articles. The site should feel like a curated architectural publication, not a CMS template.
- **Motion**: Subtle entrance animations on scroll. Smooth page transitions. Map interactions should feel fluid. No excessive animation — restraint matches the academic tone.

## Content Types (Decap CMS Collections)

### Buildings (`content/buildings/`)
Fields per entry (all text fields trilingual: `*_en`, `*_kz`, `*_ru`):
- `title` (trilingual)
- `slug`
- `latitude` (number)
- `longitude` (number)
- `year_built` (number)
- `architect` (trilingual)
- `architectural_style` (trilingual)
- `description` (trilingual, markdown)
- `photos` (list of Cloudinary image IDs)
- `current_owner` (trilingual)
- `notes_future_development`:
  - `aesthetic_notes` (trilingual, markdown)
  - `material_information` (trilingual, markdown)
  - `details_to_preserve` (trilingual, markdown)
  - `elements_to_restore` (trilingual, markdown)
  - `local_community_importance` (trilingual, markdown)
- `date_added` (datetime)

### Research (`content/research/`)
Fields:
- `title` (trilingual)
- `slug`
- `authors` (string)
- `year` (number)
- `abstract` (trilingual, markdown)
- `keywords` (list of strings)
- `citation` (string — formatted academic citation)
- `url` (optional — link to full paper)
- `date_added` (datetime)

### Gallery (`content/gallery/`)
Fields:
- `title` (trilingual)
- `slug`
- `image` (Cloudinary image ID)
- `caption` (trilingual)
- `building_ref` (relation to buildings collection, optional)
- `photographer` (string, optional)
- `year_taken` (number, optional)
- `date_added` (datetime)

### History Timeline (`content/history/`)
Fields:
- `title` (trilingual)
- `slug`
- `period_start` (number — year)
- `period_end` (number — year, optional for ongoing)
- `description` (trilingual, markdown)
- `key_buildings` (relation to buildings collection, optional, list)
- `images` (list of Cloudinary image IDs)
- `order` (number — for manual ordering)

### Future / Ideas (`content/future/`)
Fields:
- `title` (trilingual)
- `slug`
- `author` (trilingual)
- `body` (trilingual, markdown)
- `category` (select: article, project, proposal, manifesto)
- `featured_image` (Cloudinary image ID, optional)
- `date_published` (datetime)

### News (`content/news/`) — auto-generated by scraper
Fields:
- `title` (string — English, auto-generated)
- `slug`
- `summary` (string — AI-generated summary)
- `source_name` (string)
- `source_url` (string)
- `date_scraped` (datetime)
- `region_tags` (list of strings — e.g., Kazakhstan, Uzbekistan, Central Asia)

### About (`content/about.md`)
Single file:
- `mission` (trilingual, markdown)
- `bio` (trilingual, markdown)
- `contact_email` (string)
- `social_links` (list: platform + URL)

## Conventions
- All components use TypeScript
- File naming: kebab-case for files, PascalCase for components
- CSS: Tailwind CSS with custom design tokens in tailwind.config.ts matching the palette above
- All user-facing strings go through next-intl — no hardcoded English in components
- Cloudinary images always use responsive sizing via next-cloudinary CldImage component
- Every page must have proper meta tags and Open Graph data (trilingual)

## Workflow
- Commit messages: conventional commits (feat:, fix:, content:, chore:)
- All content changes via Decap CMS commit to `main` branch automatically
- Netlify auto-deploys on push to `main`

## Gotchas
- Decap CMS config.yml must match content directory structure exactly — if you change a collection folder, update both
- Cloudinary media library widget in Decap CMS requires the cloudinary-decap integration — configure in config.yml `media_library` field
- next-intl middleware must handle the locale prefix routing — don't manually parse locales
- Mapbox GL JS CSS must be imported globally or the map renders broken
- The news scraper function must handle rate limiting and failures gracefully — if a source is down, skip it and process the rest
- vlast.kz is in Russian — the scraper must handle Russian-language content and summarize in English