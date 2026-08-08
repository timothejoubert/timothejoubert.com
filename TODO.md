### TODO
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
