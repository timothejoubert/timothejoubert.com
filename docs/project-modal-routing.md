# Navigation projet en modal — Routes imbriquées (nested routes)

## Concept

Quand un utilisateur clique sur un projet depuis la home ou les archives, le projet s'affiche **par-dessus la page courante** comme une modal, sans démonter la page en background. L'URL change correctement. En accès direct (SSR), la page parent et la modal sont rendues ensemble — SEO intact.

Ce comportement est implémenté via les **nested routes natives de Nuxt/Vue Router** : la page projet est une route enfant de la home ou des archives selon son contexte.

## Structure des URLs

| Contexte | URL projet |
|---|---|
| Home (`favorite: true`) | `/projets/:uid` |
| Archives (`favorite: false`) | `/archive/:uid` |
| About | `/a-propos` |

> **Historique** : `/projets/:uid` avait été volontairement supprimé au profit d'un simple `/:uid` lors de la mise en place du routing imbriqué (voir plus bas), puis réintroduit ensuite. Les anciennes URLs `/:uid` sont redirigées en 301 vers `/projets/:uid` — voir `shared/prismic-legacy-project-redirects.ts`, calculé dynamiquement à chaque build à partir des projets `favorite: true` actuels (pas de liste figée).

## Logique de séparation home / archives

Le champ `favorite` dans Prismic détermine dans quelle page un projet apparaît :

```ts
usePrismicFetchProjects(true)   // → home     → URL /:uid
usePrismicFetchProjects(false)  // → archives → URL /archive/:uid
```

Chaque projet appartient à **un seul contexte** — pas de duplicate content, pas de canonical à gérer.

## Structure des pages Nuxt

```
app/pages/
  index.vue              ← home    — affiche VMainProjectListing + <NuxtPage />
  index/
    projets/
      [uid].vue          ← projet home en modal (/projets/:uid)
  archive.vue            ← archives — affiche VArchivePage + <NuxtPage />
  archive/
    [uid].vue            ← projet archive en modal
  a-propos.vue           ← about
```

`[...uid].vue` (catch-all actuel) est supprimé.

## Comportement selon le contexte de rendu

**Navigation client (depuis home ou archives) :**
- La page parent (`index.vue` ou `archive.vue`) reste montée et visible en background
- La route enfant (`[uid].vue`) monte par-dessus via `<NuxtPage />`
- Le scroll et l'état de la page parent sont préservés

**Accès direct par URL / SSR :**
- La page parent et son enfant se rendent ensemble côté serveur
- Le projet est visible avec son contexte (listing ou archive en background)
- Meta tags SEO issus des données du projet enfant

## Changements nécessaires

### `shared/prismic-schema.ts`
Deux routes pour le type `project` :
```ts
{ name: 'projet', type: 'project', path: '/:lang?/projets/:uid' }           // home projects
{ name: 'projet-archive', type: 'project', path: '/:lang?/archive/:uid' }   // archive projects
```

### `app/pages/index.vue`
Wrapper de la home : rend `VHomePage` (= `VMainProjectListing`) et inclut `<NuxtPage />` pour les projets enfants.

### `app/pages/archive.vue`
Wrapper des archives : rend `VArchivePage` et inclut `<NuxtPage />`.

### `app/pages/index/projets/[uid].vue` et `app/pages/archive/[uid].vue`
Composants de page projet (modal). Récupèrent le document projet via `uid`. Rendent `VProjectPage` sans le listing en background (le parent s'en charge).

### `app/components/molecules/VProjectCard.vue`
Lien généré avec `:to="project"` → à remplacer par un lien direct `/:uid` (le composant sait qu'il est toujours dans le contexte home).

### `app/components/organisms/VArchivePage.vue`
Lien vers chaque projet → à remplacer par `/archive/:uid` au lieu de `:to="project"`.

### `app/components/organisms/VProjectPage.vue`
Supprimer `<LazyVMainProjectListing />` : le listing est désormais rendu par la page parent, pas par le composant projet.

## Ce qui ne change pas

- `usePrismicFetchProjects` et la logique de fetch Prismic
- `VProjectPage` (le rendu du contenu projet)
- `VMainProjectListing` et `VProjectCard`
- `VArchivePage` (sauf les URLs des liens)
- `app.vue`
