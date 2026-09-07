# Convention d'archivage local des projets

Ce document définit la structure de dossier et le format de fichier utilisés pour archiver localement chaque projet (passé ou futur), indépendamment de Prismic mais dérivés du custom type `project` (`customtypes/project/index.json`), afin de permettre un round-trip sans perte de champ entre l'archive locale et Prismic.

Portée actuelle : uniquement la convention. Aucun script d'export (Prismic → local) ni d'import (local → Prismic, Migration API) n'existe encore.

## Structure de dossier

```
<dossier-racine>/
  <uid-du-projet>/              ← nom de dossier = uid Prismic (slug), clé stable pour le round-trip
    project.md                  ← front-matter + contenu, voir "Format de project.md"
    media/
      thumbnail.<ext>           ← fichier réel, référencé par `thumbnail` en front-matter
      meta-image.<ext>          ← fichier réel, référencé par `meta_image`
      <nom-libre>.<ext>         ← un fichier par entrée `medias` qui a un fichier local
    sources/                    ← réservé aux futurs fichiers de travail (psd, ai, figma, typo, documents annexes), créé à la main au besoin, jamais généré par un export
```

`<dossier-racine>` est libre (ex. un dossier sur le Bureau) — non figé par cette convention.

## Correspondance avec le custom type Prismic `project`

| Champ Prismic | Type Prismic | Emplacement dans l'archive |
|---|---|---|
| `uid` | UID | Nom du dossier **et** front-matter `uid` |
| `title` | Text | Front-matter `title` |
| `favorite` | Boolean | Front-matter `favorite` |
| `creative_work_type` | Select | Front-matter `creative_work_type` |
| `rate` | Number | Front-matter `rate` |
| `awards` | Group (`name`, `link`, `type`) | Front-matter `awards` (liste d'objets) |
| `tag_group` | Group (`tag`, Select) | Front-matter `tags` (liste de strings) |
| `framework` | Select | Front-matter `framework` |
| `short_description` | StructuredText (court) | Corps markdown, section `## Short description` |
| `content` | StructuredText | Corps markdown, section `## Content` |
| `thumbnail` | LinkToMedia | Fichier dans `media/`, référencé par front-matter `thumbnail` |
| `date` | Date | Front-matter `date` |
| `link` | Link | Front-matter `link` |
| `link_label` | Text | Front-matter `link_label` |
| `medias` | Group (`media`, `embed_url`, `sound_enabled`) | Front-matter `medias` (liste d'objets `file`/`embed_url` + `sound_enabled`), fichiers réels dans `media/` |
| `meta_title` | Text | Front-matter `meta_title` |
| `meta_description` | Text | Front-matter `meta_description` |
| `meta_image` | Image | Fichier dans `media/`, référencé par front-matter `meta_image` |

Chaque champ Prismic apparaît exactement une fois dans l'archive — aucun champ n'est dupliqué ni omis.

En plus de cette correspondance, le front-matter porte des champs **archive-only** sans équivalent Prismic — jamais lus ni écrits par `projects:import-source` ni `projects:export-source`, purement pour référence personnelle :
- `sources` (liste d'objets `label`/`link`) — liens vers les fichiers de travail (repo, Figma, dossier Drive...).
- `link_status` (`online` | `offline` | `archived`) — état du lien public (`link`), pour repérer sans revisiter chaque URL un projet dont le site n'est plus en ligne (cf. le cas de `timothejoubert.com`, domaine expiré et repris par un tiers).
- `collaborators` (liste d'objets `name`/`role`) — qui a travaillé sur le projet et dans quel rôle.
- `tools` (liste de strings, ex. `Figma`, `Three.js`) — outils/stack utilisés. Archive-only pour l'instant ; à ajouter au custom type Prismic `project` à l'avenir (via la CLI Prismic, cf. `TODO.md`), à ce moment-là ce champ rejoindra le tableau de correspondance ci-dessus.
- `client` (string) — organisation commanditaire du projet (mappe sur la propriété schema.org `sourceOrganization`). Archive-only pour l'instant ; même trajectoire que `tools` (à pousser vers Prismic + JSON-LD, cf. `TODO.md`).

## Valeurs autorisées

Ces listes sont dupliquées depuis `customtypes/project/index.json` — elles font foi pour l'archive
même si Prismic ou ce fichier disparaissent. Si le custom type Prismic évolue, mettre à jour ici aussi.

- **creative_work_type** : CreativeWork | WebSite | SoftwareApplication | VisualArtwork | VideoObject
- **framework** : Freelance | Perso | Rézo zéro | Master 2 | DSAA | DEC | BTS | STD2A
- **tags** : Développement, Typographie, Design d'interface, Identité visuelle, Code créatif,
  Motion design, Édition, Illustration, Expression plastique, Multimédia
- **awards.type** : book | web

## Format de `project.md`

```markdown
---
uid: mon-projet
title: Mon Projet
favorite: true
date: 2024-03-01
creative_work_type: CreativeWork   # CreativeWork | WebSite | SoftwareApplication | VisualArtwork | VideoObject
framework: Perso                    # Freelance | Perso | Rézo zéro | Master 2 | DSAA | DEC | BTS | STD2A
client:                              # archive-only pour l'instant (à ajouter au custom type Prismic `project` à l'avenir, mappe sur schema.org `sourceOrganization`)
rate:
link:
link_label:
tags:
  - Développement                   # valeurs alignées sur les options `tag_group.tag` dans Prismic :
                                     # Développement, Typographie, Design d'interface, Identité visuelle,
                                     # Code créatif, Motion design, Édition, Illustration,
                                     # Expression plastique, Multimédia
  - Design d'interface
awards:
  - name: Nom du prix
    type: web                       # book | web
    link:
medias:
  - file: media/hero.mp4
    sound_enabled: false
  - embed_url: https://vimeo.com/xxxx
    sound_enabled: true
thumbnail: media/thumbnail.jpg
meta_title:
meta_description:
meta_image: media/meta-image.jpg
sources:                            # archive-only, jamais synchronisé vers Prismic
  - label: Repo
    link: https://github.com/...
link_status: online                 # archive-only — online | offline | archived
collaborators:                      # archive-only
  - name: Prénom Nom
    role: Design
tools:                               # archive-only pour l'instant (à ajouter au custom type Prismic `project` à l'avenir)
  - Figma
---

## Short description

<équivalent du champ `short_description`, un paragraphe>

## Content

<équivalent du champ `content`, contenu détaillé, markdown standard (titres, listes, liens, gras/italique) qui mappera vers le RichText Prismic>
```

Règles :
- `uid` est dupliqué dans le front-matter (en plus du nom de dossier) pour rester robuste si le dossier est renommé.
- `tags` est une liste simple de strings plutôt qu'un objet imbriqué — plus lisible/éditable à la main que la structure Group de Prismic.
- Chaque entrée `medias` porte **soit** `file` (chemin relatif vers `media/`) **soit** `embed_url`, jamais les deux.
- Les sections `## Short description` et `## Content` sont fixes, dans cet ordre, pour rester repérables sans ambiguïté par un futur parseur.

## Template

Un squelette vide prêt à copier pour chaque nouveau projet se trouve dans `scripts/templates/project-template.md`.
