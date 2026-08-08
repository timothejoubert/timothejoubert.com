### TODO
- ajouter package sitemap et robots de nuxt
- Mettre à jour toutes les deps et vérifier pnpm audit
- Ajouter une page/redirection Nuxt dédiée pour que les `alias` de `prismicDocumentRoutes` (ex. `/projets`, `/projects`) résolvent réellement vers la bonne page via `getDocumentTypeByUrl`, au lieu d'être seulement pris en compte côté fallback de `useFetchPage`

- VProjectPage: Add reveal and switch animation to reveal content
- VProjectPage: Add backdrop or find a design hack to highlight VWindow with background
- VSpashScreen: add animation (from tim label to navBar transition ?)

- VArchivePage: ajouter sort par Cadre (alphabetique) et étiquette (alphabetique)

- Ajouter les data schema.org
- CMS: sync data field with schema.org (Project document need more field to specify CreativeWork)

### improvement
- Add runtime config to disabled fetch to prismic assets CDN (prevent consume free plan bandwidth)

### Done
- Vérifier que le projet est bien lié au repo https://github.com/timothejoubert/timothejoubert.com sur une branche spécifique (remote `origin` et branche `nuxt4` confirmés)
- Add stylelint and eslint format rules on save (`.vscode/settings.json`)

- More generic setup of prismic document type (`shared/prismic-document.ts`: `isDynamicDocument` dérive maintenant de `prismicDocumentRoutes` au lieu d'être codé en dur par type ; suppression des helpers `isXDocument` inutilisés)

- VUserSetting: card grid size feature (`app/composables/use-grid-columns.ts` + `VSettingModal.vue` + `VMainProjectListing.vue`, pilotage du nombre de colonnes de la home via une CSS var persistée en cookie)

- VUserSetting: hover shape animation, effet aimant — la shape (`::after`) se déplace (translate) entre le centre du bouton et le point exact d'entrée/sortie du curseur avec un léger scale à l'apparition (0.85→1), zone de détection élargie via un `::before` invisible sur `.root` (z-index négatif, poli vis-à-vis du contenu voisin) pour capter l'approche, `.button` en `overflow:hidden` + `isolation:isolate` pour contenir la shape et garder l'icône visible par-dessus (`app/composables/use-magnet-hover.ts` + `VSettingModal.vue`, `pointerenter`/`pointerleave`, réutilisable par d'autres composants)

- VProjectPage: navigation précédent/suivant en footer, ordre du listing d'origine (home/archive selon `favorite`), boucle aux extrémités (`app/composables/use-project-neighbors.ts` + `VProjectPage.vue`)

- Revoir le système de routing/types Prismic pour un template générique et centralisé : `PrismicDocumentType` vient maintenant uniquement des types générés par Prismic (`app/types/api.ts` ← `prismicio-types.d.ts`) ; `shared/prismic-document.ts` valide ses constantes contre ce type via `satisfies` au lieu de dupliquer les valeurs à la main ; `PrismicDocumentPageType` et `isDynamicDocument` dérivent tous les deux de `prismicDocumentRoutes` (plus de liste séparée à resynchroniser) ; suppression de `PROJECT_LISTING_PAGE` (type Prismic orphelin, jamais routé/fetché) et de `prismicDocumentRoute` (export mort marqué `@deprecated`). ⚠️ Bug pré-existant découvert en testant (non lié à ce chore, reproduit même en annulant tous les changements de la session) : `/archive/diesel-fragrance` renvoie une 500 (`Cannot read properties of null (reading 'links')` dans VMainNav.vue) — le fetch du document `menu` semble échouer pour cette page precisément, à investiguer séparément.

- `shared/prismic-document.ts` + `shared/prismic-routes.ts` fusionnés en `shared/prismic-schema.ts` (un seul fichier = identité des types + leurs routes) ; `prismicDocumentRoutes` référence `prismicDocumentType.X` au lieu de chaînes dupliquées.

- Refactor `getDocumentTypeByUrl` (`app/utils/prismic/route-resolver.ts`) : matching par template générique segment par segment (gère n'importe quel `:param`, pas seulement `:lang?`/`:uid` en dur), suppression du check `path === prismicRoute.path` mort (ne matchait jamais en pratique). TODO "find item by alias too" fait : les routes supportent un champ `alias?: string[]` (ex. `index` accepte aussi `/projets`, `/projects`) vérifié par le même matcher. Suppression de `app/utils/string/extract.ts` (`getPosition`/`extractValueBetweenOccurrence`), devenu mort suite au refactor. ⚠️ Limite à noter : `getDocumentTypeByUrl` n'est actuellement utilisé qu'en fallback dans `useFetchPage` quand aucun type n'est passé explicitement — or toutes les pages actuelles passent un type explicite, donc les alias ne créent pas encore de vraies routes navigables (`/projets` renvoie toujours une page introuvable/erreur côté Nuxt, qui route par fichier sans connaître cette config). Pour que `/projets` redirige réellement vers la home, il faudrait une page/redirection Nuxt dédiée — à faire si besoin.

- Favicon + manifeste + formats multiples : régénéré `apple-touch-icon.png` (180×180, la marque "T" existante) → `favicon.ico` (32×32, corrigé — l'ancien fichier n'était pas un ICO valide), `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest` (theme_color/background_color repris des couleurs du thème "main"). Tout déclaré dans `nuxt.config.ts` (`app.head.link`/`meta`), compatible avec le `theme-color` dynamique déjà géré par `VThemeSwitcher.vue`.
- Vérification des data OG sur toutes les pages (home, archive, about, projet home, projet archive) → 2 bugs trouvés et corrigés dans `use-page-meta.ts`/`use-prismic-meta.ts`/`use-link-resolver.ts` : (1) `NUXT_PUBLIC_SITE_URL` sans schéma (`localhost:3000`) produisait des `og:url`/`og:image` invalides (`localhost:3000/...` au lieu de `http://localhost:3000/...`) — ajout de `ensureProtocol()` (`app/utils/url.ts`) appliqué partout où `site.url` sert à construire une URL absolue ; (2) `canonicalUrl`/`og:url` préférait `doc.value.url` (résolution Prismic ambiguë pour les types partageant plusieurs routes, ex. project home vs archive) à `route.path` (toujours correct) — priorité inversée, ex. `/hugo-tomasi` affichait `og:url: .../archive/hugo-tomasi` avant fix.
