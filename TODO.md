### TODO
- Revoir tous le syteme de routing et fonction utiles pour déterminer les routes et les types associés, l'objectif est d'avoir un systeme générique et centralisé à utiliser comme template pour tous mes autressite fait avec prismic

- VProjectPage: Add prev and next project in VProjectPage footer
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
