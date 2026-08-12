# CMS : champ de type schema.org/CreativeWork sur les projets

Feature à faire plus tard (documentée ici plutôt qu'implémentée tout de suite). Cf. TODO.md.

## Contexte

Prépare le custom type Prismic `project` en vue de la structuration schema.org à venir (item TODO suivant : "Ajouter les data schema.org avec les modules Nuxt", qui branchera un module JSON-LD sur ces données — hors scope ici). Deux sous-questions posées par le TODO d'origine :
1. Ajouter un champ Select pour typer chaque projet selon un sous-type `CreativeWork` de schema.org.
2. Vérifier si des données supplémentaires sont nécessaires selon le type choisi.

Le repo n'a aujourd'hui **aucune** infrastructure schema.org/JSON-LD (vérifié : rien dans `package.json`, aucun composable, aucun script `application/ld+json`). Ce chantier est donc purement un ajustement de modèle de contenu CMS, sans impact applicatif immédiat.

## Existant (`customtypes/project/index.json`)

Champs déjà pertinents pour schema.org : `title` (name), `short_description`/`content` (description), `thumbnail` (image), `date` (dateCreated/datePublished), `link` (url), `awards` (award — groupe `name`/`link`/`type: book|web`). Pattern Select existant (`framework`, `tag_group.tag`, `awards.type`) : un simple tableau de strings dans `config.options`, sans libellés séparés.

## Plan

### 1. Ajouter le champ `creative_work_type`

Dans `customtypes/project/index.json`, tab `Main`, juste après `favorite` (classification de premier niveau) :

```json
"creative_work_type": {
    "type": "Select",
    "config": {
        "label": "Type (schema.org)",
        "placeholder": "",
        "options": ["CreativeWork", "WebSite", "SoftwareApplication", "VisualArtwork", "VideoObject"]
    }
}
```

- Valeurs stockées **en anglais**, littéralement les noms de types schema.org — c'est la valeur injectée telle quelle en `@type` dans le JSON-LD du chantier suivant, pas besoin de mapping ultérieur.
- `CreativeWork` = type générique/fallback (site quelconque, rapport, projet non catégorisable).
- Champ optionnel (pas de `default_value`, cohérent avec `framework`) — les projets existants auront ce champ vide jusqu'à recatégorisation manuelle dans Prismic.
- Nom délibérément différent de `awards[].type` (déjà existant, sans rapport) pour éviter toute confusion.

### 2. Régénérer les types

`pnpm type-gen` → `prismicio-types.d.ts` expose `creative_work_type: SelectField<"CreativeWork" | "WebSite" | "SoftwareApplication" | "VisualArtwork" | "VideoObject">` sur `ProjectDocumentData`. Aucune autre édition de fichier `.ts`/`.vue` nécessaire — le champ ne sera consommé par aucun composant tant que le chantier JSON-LD suivant n'est pas fait.

### 3. Faut-il des données supplémentaires selon le type ?

**Non, pas pour l'instant.** Les propriétés spécifiques à certains sous-types (`VideoObject.duration`, `SoftwareApplication.applicationCategory`, etc.) sont des enrichissements optionnels en JSON-LD, jamais requis pour un contenu valide — et les champs génériques déjà présents (`title`, `short_description`/`content`, `thumbnail`, `date`, `awards`, `link`) couvrent déjà les propriétés `CreativeWork` de base (`name`, `description`, `image`, `dateCreated`, `award`, `url`) quel que soit le `@type` choisi. Ajouter des champs par type maintenant serait de la spéculation sur des besoins pas encore vérifiés — à réévaluer concrètement pendant le chantier JSON-LD, une fois qu'on voit vraiment ce qui manque.

### 4. Étape manuelle (à faire par toi)

Éditer le JSON local ne suffit pas à synchroniser le custom type vers le repo Prismic distant — il faudra lancer `pnpm slicemachine` et pousser le changement depuis son interface (pas d'accès direct au compte/repo Prismic distant).

### 5. TODO.md

Une fois implémenté, déplacer l'entrée correspondante vers `### Done` avec un résumé (champ ajouté + décision "pas de données supplémentaires pour l'instant").

## Vérification (une fois implémenté)

- `pnpm type-gen` s'exécute sans erreur et `creative_work_type` apparaît dans `prismicio-types.d.ts`.
- `pnpm lint:js`/`pnpm build` ne cassent pas.
