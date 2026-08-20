# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nuxt 4 portfolio site (timothejoubert.com) content-driven by Prismic CMS. Package manager is **pnpm**.

## Commands

```bash
pnpm dev              # dev server (localhost:3000)
pnpm build            # production build
pnpm generate         # static generation
pnpm preview          # preview production build

pnpm lint             # eslint + stylelint
pnpm lint-fix         # same, with --fix
pnpm lint:js          # eslint only
pnpm lint:css         # stylelint only (*.vue, *.css, *.scss)

npx prismic pull      # pull custom type / slice models from Prismic (Type Builder)
npx prismic push      # push local custom type / slice models to Prismic
pnpm type-gen         # regenerate prismicio-types.d.ts from customtypes/** models (npx prismic-ts-codegen)
pnpm prismic:backup   # run scripts/prismic-backup.js
```

There is no test runner configured in this repo — do not assume Vitest/Jest exists.

## Architecture

### Prismic-driven routing

Pages are backed by Prismic documents. `shared/prismic-routes.ts` is the **single source of truth** mapping Prismic document types to URL paths (`prismicDocumentRoutes`). Use `getRoutePath(name, params)` to build URLs rather than hardcoding paths — never index `prismicDocumentRoutes` directly by type for lookups with collisions, use `prismicRouteByName`.

Document-type genericity is layered so nothing needs hand-syncing when a Prismic custom type is added/removed:
- `app/types/api.ts`'s `PrismicDocumentType` is derived straight from the Prismic-codegen'd `AllDocumentTypes` (`prismicio-types.d.ts`) — the actual single source of truth for "what document types exist." Always import `PrismicDocumentType` from here, not re-declare it.
- `shared/prismic-document.ts`'s `prismicDocumentType` object gives friendly named constants (`prismicDocumentType.HOME_PAGE`, etc.) for call-site ergonomics, but every value is checked against `PrismicDocumentType` via `satisfies` — a renamed/removed custom type fails to compile there instead of silently drifting.
- `PrismicDocumentPageType` (routable page types) and `isDynamicDocument` (repeatable/`:uid` types) are both derived from `prismicDocumentRoutes`, not separately hand-listed — adding a new routable type only means adding one entry to `prismicDocumentRoutes`.

Project pages are implemented as **nested routes** so a project opens as a modal over the listing page instead of unmounting it (SSR still renders both together for SEO). See `docs/project-modal-routing.md` for the full rationale. Concretely:
- `app/pages/index.vue` renders the home listing + `<NuxtPage />`; `app/pages/index/[uid].vue` is the child project modal for home ("favorite") projects.
- `app/pages/archive.vue` renders `VArchivePage` + `<NuxtPage />`; `app/pages/archive/[uid].vue` is the child project modal for archived projects.
- The Prismic `favorite` boolean field on a project determines which single context (home vs archive) it belongs to — a project never appears in both, so there's no canonical/duplicate-content concern.
- `usePrismicFetchProjects(true|false)` fetches the home vs. archive project set respectively.

### Imports — prefer Nuxt aliases

Use Nuxt's built-in path aliases (`~`/`@` for the app dir, `~~`/`@@` for the root, `#shared` for the `shared/` dir, etc.) instead of relative paths (`../../foo`) when importing across directories. This keeps imports stable when files move. Relative imports (`./foo`) remain fine for files in the same directory.

### Prefer type inference over explicit types

Let TypeScript infer types (`computed`, `ref`, function return types, etc.) instead of writing an explicit generic/annotation when inference already gives the correct type — e.g. `computed(() => cond ? 'asc' : 'desc')` already infers `'asc' | 'desc'`, so don't add `computed<'asc' | 'desc'>(...)` on top of it. Only add an explicit type when inference would be wrong or wider than intended (e.g. an empty array/object literal, a value that needs to satisfy an interface it doesn't structurally match, or a genuinely ambiguous return across branches).

### Prefer VueUse over hand-rolled utilities

`@vueuse/nuxt` is a dependency and its composables are auto-imported. Before writing a new composable (or a chunk of imperative DOM/browser logic — mouse/pointer tracking, element bounding rects, resize/intersection observers, storage, clipboard, etc.), check whether VueUse already covers it (e.g. `useMouseInElement`, `useElementBounding`, `useResizeObserver`) and use that instead of reimplementing it. Only hand-roll when VueUse's composable doesn't fit the actual requirement (e.g. its geometry/behavior doesn't match what's needed) — and note briefly why when that's the case.

### Composables drive page data fetching

Prismic fetching/meta logic lives in `app/composables/use-*.ts` (e.g. `useFetchPage`, `usePrismicFetchDocument`, `usePrismicFetchProjects`, `usePage`, `usePageMeta`, `usePrismicMeta`, `usePrismicPreviewRoute`). `useFetchPage` resolves the Prismic document type from the route (via `getDocumentTypeByUrl` in `app/utils/prismic/route-resolver.ts`) when not explicitly given, fetches the document, calls `usePage` to register it, and throws a Nuxt error (via `showError`) on 404/fetch failure. Page-level `.vue` files should stay thin and delegate to these composables rather than reimplementing fetch/error logic.

### Component structure — atomic design

`app/components/{atoms,molecules,organisms}` (auto-imported, see `nuxt.config.ts` `components` option). All components are prefixed `V` (e.g. `VText`, `VIcon`, `VProjectPage`). Roughly:
- **atoms**: primitive rendering wrappers, often around Prismic fields (`VText`, `VRichText`, `VPrismicImg`, `VPrismicLink`, `VTag`, `VImg`).
- **molecules**: composed UI pieces (`VProjectCard`, `VWindow`, `VThemeSwitcher`, `VHighlightedText`).
- **organisms**: full page sections/screens rendered by page routes (`VHomePage`, `VArchivePage`, `VProjectPage`, `VAboutPage`, `VMainNav`, `VSettingModal`).

`VText` is the standard way to render a field that may be a plain string, a Prismic `KeyTextField`, or a `RichTextField` — it picks the right render path (plain tag, slot, or `PrismicRichText`) automatically; prefer it over branching on field type by hand.

Props are declared with the **TypeScript generic** form of `defineProps<{ ... }>()` (with `withDefaults` when defaults are needed), not the runtime object form (`defineProps({ name: { type: String, ... } })`). The generic form is the convention across every component in this repo — use it even for simple/optional props instead of reaching for `PropType`.

### Prismic utilities

`app/utils/prismic/*` centralizes Prismic field handling: link resolution (`link-field.ts`, `prismic-link-to.ts`, `route-resolver.ts`), image fields (`image-field.ts`, `prismic-media.ts`), content relationships (`content-relationship-field.ts`), and dates (`prismic-date.ts`). `shared/prismic-document.ts` defines `prismicDocumentType`/`PrismicDocumentPageType`. Prismic custom type models live in `customtypes/**/index.json`, managed via the `prismic` CLI / Type Builder (not Slice Machine, which this project has migrated away from); run `pnpm type-gen` after changing them to refresh `prismicio-types.d.ts` (this generated file is eslint-ignored — never hand-edit it).

### Styling

SCSS Modules (`<style lang="scss" module>` + `$style.xxx` in templates), BEM-like class naming enforced by stylelint (`selector-class-pattern` in `stylelint.config.mjs`). Shared SCSS lives under `app/assets/scss/`:
- `variables/`, `functions/`, `mixins/` — design tokens and helpers (breakpoints, colors, ease curves, fluid sizing, grid, typography).
- `export/*.module.scss` — SCSS values exported to JS/TS via CSS modules (breakpoints, colors, ease curves, grid, theme).
- Global entry point is `app/assets/scss/main.scss`, loaded via `nuxt.config.ts` `css`.

Indentation is **tabs**, enforced by ESLint (`@stylistic/indent: ['error', 'tab']`, `no-tabs` allows indentation tabs only). This applies across `.ts`/`.vue`/config files, not just SCSS.

### SCSS rules

- Every component's `<style>` block is `lang="scss" module` — classes are always accessed as `$style.xxx` in the template, never `class="foo"` directly and never `scoped`.
- Keep class selectors **flat, one level of nesting max**. Avoid descendant selector nesting (`.parent { .child { ... } }`); each BEM-ish part (`root`, `title`, `tags`, `tag`, `img`, `head`, `list`, `item`, `link`...) gets its own top-level `.class { }` block. This is why `no-descending-specificity` is disabled in `stylelint.config.mjs` — specificity is expected to stay flat.
- `&` nesting is fine, but only for what's about the selector itself: pseudo-elements/classes (`&::before`, `&:hover`), BEM modifiers (`&--resizing`), and nested at-rules (`@media (hover: hover) { ... }`, `@supports (...) { ... }`). Don't use `&` to reach into descendants.
- To style a child based on a parent state (hover, modifier class, etc.), write the rule **inside the child's own block** using the parent class as a prefix, instead of nesting the child under the parent:
  ```scss
  // ✅ do this — in .tag's own block
  .tag {
      @media (hover: hover) {
          .root:hover & {
              translate: 0;
          }
      }
  }

  // ❌ not this — nested under .root
  .root {
      &:hover .tag { translate: 0; }
  }
  ```
- Component-local one-off values go in a `$sass-variable` declared at the top of the `<style>` block (e.g. `$card-padding: 16px;`, `$handle-edge: 4px;`), not inline magic numbers repeated across the block. Shared/global tokens (breakpoints, colors, ease curves, spacing) come from `app/assets/scss/variables|functions|mixins` — these are auto-available in every component via the global `@use "assets/scss/_resources.scss" as *;` injected in `nuxt.config.ts` (`vite.css.preprocessorOptions.scss.additionalData`), so don't add your own `@use`/`@import` for them.
- Don't hand-order CSS properties — `stylelint-config-idiomatic-order` enforces property order and `pnpm lint-fix` will reorder them; just write properties and let lint fix ordering.
- Class names must match the BEM-like pattern enforced by stylelint (`selector-class-pattern`): lowercase, hyphen-separated, optional `__element` / `--modifier` suffixes (e.g. `resize-handle--n`).
- Run `pnpm lint:css` (or `pnpm lint-fix`) after touching SCSS — several rules (property order, empty-line-before at-rules, etc.) are auto-fixable and shouldn't be hand-formatted.

### i18n

`i18n/i18n.ts` defines `I18N_DEFAULT_LOCALE`/`I18N_LOCALES`; locale message files are `i18n/locales/nuxt.<locale>.json`. Routing strategy is `prefix_except_default` (default locale has no prefix, matching the `/:lang?` optional segment in `prismicDocumentRoutes`).

Every static UI string (labels, aria-labels, fallback/error/empty-state messages, etc.) must go through an i18n key — `$t('key')` in templates, `t('key')` in `<script>` (via `useI18n()`). Never hardcode static text directly in a template or script, even a single word — add the key to `i18n/locales/nuxt.<locale>.json` instead. This does **not** apply to content coming from Prismic fields (already localized at the CMS level).

### SVGs and icons

SVGs are imported as URLs via `vite-svg-loader` (`defaultImport: 'url'`) — see `nuxt.config.ts` `vite.plugins`. `@nuxt/icon` is configured with `componentName: 'NuxtIcon'` and only bundles the `material-symbols` collection server-side; check `app/components/atoms/VIcon.vue` for how icons are dispatched between local SVGs and `NuxtIcon`.

## Notes

- `runtimeConfig.public.site.env` distinguishes production (`NUXT_PUBLIC_SITE_ENV=production`) from other environments; `isProd` in `nuxt.config.ts` gates things like the Prismic toolbar.
- Preview mode routing is defined in `app/constants/prismic-preview.ts` (`PREVIEW_PATH`) and handled by `usePrismicPreviewRoute`.
