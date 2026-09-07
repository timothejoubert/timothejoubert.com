# timothejoubert.com

Portfolio Nuxt 4, contenu piloté par [Prismic](https://prismic.io). Gestionnaire de paquets : **pnpm**.

## Setup

```bash
pnpm install
```

## Développement

```bash
pnpm dev              # serveur de dev (localhost:3000)
```

## Production

```bash
pnpm build            # build de production
pnpm generate         # génération statique
pnpm preview          # preview du build de production
```

## Lint

```bash
pnpm lint             # eslint + stylelint
pnpm lint-fix         # idem, avec --fix
```

## Architecture

Quelques éléments structurants pour se repérer dans le code (détails complets dans `CLAUDE.md`, destiné à Claude Code mais utile à toute personne qui reprend le projet) :

- **Routing piloté par Prismic** — `shared/prismic-schema.ts` est la source de vérité qui fait correspondre chaque type de document Prismic à une route (`prismicDocumentRoutes`). Une page projet s'ouvre en modale par-dessus le listing (home ou archive) via des routes imbriquées (`app/pages/index/[uid].vue`, `app/pages/archive/[uid].vue`) plutôt qu'en remplaçant la page — voir `docs/project-modal-routing.md`.
- **Composables pour le fetch de données** — la logique de récupération Prismic vit dans `app/composables/use-*.ts` (`useFetchPage`, `usePrismicFetchDocument`, `usePrismicFetchProjects`...) ; les fichiers `.vue` de pages restent volontairement fins et délèguent à ces composables.
- **Composants en atomic design** — `app/components/{atoms,molecules,organisms}`, tous préfixés `V` (`VText`, `VProjectCard`, `VHomePage`...), auto-importés.
- **Utilitaires Prismic centralisés** — `app/utils/prismic/*` gère la résolution de liens, les images, les content relationships et les dates ; les custom types Prismic vivent dans `customtypes/**/index.json` (géré via la CLI `prismic`, pas Slice Machine).
- **Styling** — SCSS Modules (`<style lang="scss" module>` + `$style.xxx`), classes BEM-like, tokens partagés dans `app/assets/scss/` (variables, fonctions, mixins).
- **i18n** — toute chaîne d'UI statique passe par une clé i18n (`i18n/locales/nuxt.<locale>.json`), sauf le contenu Prismic déjà localisé côté CMS.

## Archive locale des projets (`projects-source/`)

Chaque projet (passé ou futur, digital ou non) a vocation à vivre en local dans `projects-source/<uid>/`, indépendamment de Prismic mais dérivé de son custom type `project` — l'ambition est d'avoir une base de vérité en texte brut (markdown + front-matter YAML) qui n'a besoin d'aucun CMS ni outil propriétaire pour rester lisible et éditable. Prismic devient une simple destination de publication générée à partir de cette source, pas le seul endroit où l'information existe. Convention complète (structure de dossier, correspondance avec les champs Prismic, valeurs autorisées, champs archive-only comme `sources`/`tools`/`client`) : [`docs/project-source-structure.md`](docs/project-source-structure.md). Un squelette vide pour un nouveau projet est disponible dans [`scripts/templates/project-template.md`](scripts/templates/project-template.md).

Scripts associés :

```bash
pnpm projects:check-source    # vérifie que chaque project.md est valide (champs, fichiers médias référencés existent, pas d'orphelins)
pnpm projects:export-source   # génère projects-source/ à partir des projets déjà publiés dans Prismic
pnpm projects:import-source   # pousse les projets nouveaux/modifiés de projects-source/ vers Prismic (Migration API, PRISMIC_WRITE_TOKEN requis)
```

Seul `project.md` est versionné dans ce repo ; les dossiers `media/` et `sources/` de chaque projet restent en local (voir `TODO.md` pour la mise en place prévue de Git LFS sur `media/`).
