# Audit performance / requêtes réseau (2026-09-09)

Site en `netlify-static` (SSG, `nuxt.config.ts` `nitro.preset`), donc la majorité des requêtes Prismic se font au build — impact runtime nul sur ces points-là. Ce document liste les pistes restantes après un audit rapide.

## Assets Prismic (`images.prismic.io`)

Déjà géré, rien à faire côté Netlify :
- Ces images sont servies directement depuis un domaine tiers (imgix, le CDN sous-jacent de Prismic), en cross-origin — vérifié via `curl -I` (`server: imgix`, `access-control-allow-origin: *`). Les règles de cache Netlify (`netlify.toml`/`_headers`) ne s'appliquent qu'aux assets servis depuis le domaine du site, donc n'auraient aucun effet ici.
- Le cache est géré par imgix/Prismic (headers `Cache-Control` longue durée sur les vraies images), pas une caractéristique à reconfigurer.

## Pistes identifiées

### 1. Preconnect vers `images.prismic.io` — ✅ résolu
`<link rel="preconnect" href="https://images.prismic.io">` ajouté dans `nuxt.config.ts` (`app.head.link`), **sans** `crossorigin` : les images Prismic sont chargées en `<img>` no-cors (aucun appelant ne passe `crossorigin`), et une connexion ouverte en mode CORS ne serait pas réutilisée pour elles.

### 2. Image LCP priorisée — ✅ résolu
`VImg` accepte une prop `fetchpriority` (`app/utils/image.ts`), transmise telle quelle par `VPrismicImg`. Les images restent `loading="lazy"` par défaut, sauf :
- la 1re carte du listing d'accueil (`VMainProjectListing` → prop `priority` de `VProjectCard`) : `loading="eager"` + `fetchpriority="high"`, seulement quand aucun projet n'est ouvert par-dessus (sinon c'est l'image de la modale qui est la LCP) ;
- l'image principale (`thumbnail`) de `VProjectPage` : `loading="eager"` + `fetchpriority="high"` (les `medias` en dessous restent lazy).

Pas de `<link rel="preload">` : le HTML est prérendu (SSG) et contient déjà l'`<img>` tôt, `fetchpriority` suffit.

### 3. Fonts — ✅ résolu
Les fonts sont auto-hébergées et déclarées à la main via `@font-face` en SCSS (`app/assets/scss/_fonts.scss` + `app/assets/fonts/*.woff2`), avec `font-display: swap`. Le module `@nuxt/fonts`, inutilisé, a été retiré, et `app/app.vue` preload `pp-fraktion-sans-variable.woff2` (font du `body`) via `useHead` en important l'URL hashée par Vite (même asset que le `@font-face`).

## Vérifié sans anomalie (rien à faire)
- **Requêtes Prismic** : pas de N+1 dans `usePrismicFetchProjects`/`usePrismicFetchDocument`, et de toute façon fetch au build (SSG).
- **Bundle JS** : pas de dépendance lourde (`package.json`) type gsap/three/lenis.
- **Scripts tiers** : `app/app.vue` ne charge rien sans condition ; Prismic toolbar déjà gated par `isProd`.
- **Cache-Control Nitro** : `routeRules` n'ajoute que des headers de sécurité — normal et suffisant, Netlify applique déjà un cache long/immutable sur les assets hashés `_nuxt/*`.
