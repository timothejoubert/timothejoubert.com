# Audit performance / requêtes réseau (2026-09-09)

Site en `netlify-static` (SSG, `nuxt.config.ts` `nitro.preset`), donc la majorité des requêtes Prismic se font au build — impact runtime nul sur ces points-là. Ce document liste les pistes restantes après un audit rapide.

## Assets Prismic (`images.prismic.io`)

Déjà géré, rien à faire côté Netlify :
- Ces images sont servies directement depuis un domaine tiers (imgix, le CDN sous-jacent de Prismic), en cross-origin — vérifié via `curl -I` (`server: imgix`, `access-control-allow-origin: *`). Les règles de cache Netlify (`netlify.toml`/`_headers`) ne s'appliquent qu'aux assets servis depuis le domaine du site, donc n'auraient aucun effet ici.
- Le cache est géré par imgix/Prismic (headers `Cache-Control` longue durée sur les vraies images), pas une caractéristique à reconfigurer.

## Pistes identifiées

### 1. Preconnect manquant vers `images.prismic.io`
Aucun `<link rel="preconnect">` dans `nuxt.config.ts` (`app.head.link`, lignes 22-29). À ajouter, avec `crossorigin` — gain sur les pages avec beaucoup d'images au-dessus de la ligne de flottaison (listing home/archive, page projet).

### 2. Image LCP sans priorité explicite
`VImg`/`VPrismicImg` (`app/components/atoms/`) supportent déjà `loading`, `preload`, `fetchpriority` — mais aucun appelant (`VProjectCard.vue`, `VHomePage.vue`, `VProjectPage.vue`) ne les utilise explicitement. Pas de garantie que la 1ère image visible (LCP) soit priorisée par le navigateur.
- 1ère carte du listing / image hero de `VProjectPage` → `loading="eager"` + `fetchpriority="high"`.
- Reste de la grille → `loading="lazy"` explicite.

### 3. Fonts — `@nuxt/fonts` inutilisé + pas de preload
Les fonts sont auto-hébergées et déclarées à la main via `@font-face` en SCSS (`app/assets/scss/_fonts.scss` + `app/assets/fonts/*.woff2`), avec `font-display: swap` (déjà bien). Mais le module `@nuxt/fonts` est activé dans `nuxt.config.ts` sans être réellement utilisé pour ces fichiers (poids mort potentiel), et aucun `<link rel="preload" as="font">` n'existe pour les fonts critiques above-the-fold.
- Soit configurer `@nuxt/fonts` pour qu'il gère ces fichiers (preload auto), soit ajouter un preload manuel dans `app.head.link`.

## Vérifié sans anomalie (rien à faire)
- **Requêtes Prismic** : pas de N+1 dans `usePrismicFetchProjects`/`usePrismicFetchDocument`, et de toute façon fetch au build (SSG).
- **Bundle JS** : pas de dépendance lourde (`package.json`) type gsap/three/lenis.
- **Scripts tiers** : `app/app.vue` ne charge rien sans condition ; Prismic toolbar déjà gated par `isProd`.
- **Cache-Control Nitro** : `routeRules` n'ajoute que des headers de sécurité — normal et suffisant, Netlify applique déjà un cache long/immutable sur les assets hashés `_nuxt/*`.

## Priorité si on ne fait que 2 choses
1. Preconnect vers `images.prismic.io`.
2. `fetchpriority`/preload sur l'image LCP du listing et de la page projet.

Les deux sont des gains faciles, sans risque de régression.
