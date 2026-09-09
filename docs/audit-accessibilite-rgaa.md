# Audit d'accessibilité — RGAA 4.1

Ce document est un état des lieux d'accessibilité du site, basé sur le **RGAA 4.1** (référentiel français officiel, aligné sur **WCAG 2.1** niveau AA et sur la norme européenne harmonisée **EN 301 549**, qui constitue la base légale de la directive européenne 2016/2102 sur l'accessibilité des sites publics).

## Préambule

- **Périmètre** : site public (`timothejoubert.netlify.app`), pages Home, Archive, About, page projet (modale). Le back-office Prismic (CMS) est hors périmètre.
- **Référentiel** : RGAA 4.1, avec renvois WCAG 2.1 AA et EN 301 549 quand pertinent.
- **Méthode** :
  - Analyse statique du code source (composants Vue, SCSS, i18n).
  - Tests live sur `timothejoubert.netlify.app` : structure DOM, calcul de ratios de contraste, présence/fonctionnement du lien d'évitement, comportement des liens externes, hiérarchie des titres.
- **Limites de cet audit** (à couvrir dans un audit de suite si nécessaire) :
  - Pas de test avec un lecteur d'écran réel (NVDA, JAWS, VoiceOver).
  - Pas de test utilisateur avec des personnes en situation de handicap.
  - La navigation clavier complète (ordre de tabulation, piège au clavier) n'a pas pu être vérifiée de façon fiable par l'outil d'automatisation utilisé (les événements clavier synthétiques via CDP ne déclenchent pas toujours l'avance de focus native du navigateur) — **un test manuel clavier réel reste à faire**, en particulier sur la modale projet et le panneau de réglages.
  - Le contenu riche saisi dans Prismic (titres, alternatives textuelles d'image) n'a pas été audité éditorialement — seul le mécanisme de rendu (le code) a été vérifié.

---

## Synthèse

| # | Constat | Thématique RGAA | Gravité |
|---|---|---|---|
| 1 | Liens externes (`target="_blank"`) sans indication annoncée d'ouverture dans un nouvel onglet | 6. Liens | Modérée |
| 2 | Poignées de redimensionnement de la modale projet non pilotables au clavier | 7. Scripts | Modérée |
| 3 | `aria-label` du lien d'évitement codé en dur (hors i18n) | 8. Structuration | Mineure |
| 4 | Coquille dans une clé i18n (accent manquant) | 8. Structuration | Mineure |
| 5 | Hiérarchie de titres dans le rich text Prismic non contrôlée par le code | 9. Présentation de l'information | À surveiller (éditorial) |
| 6 | Absence d'outillage de test d'accessibilité automatisé en CI | Transverse | Recommandation |
| 7 | Navigation clavier complète non vérifiée de façon fiable (limite d'outillage) | 12. Navigation | À tester manuellement |

**Points forts confirmés** : lien d'évitement fonctionnel, `lang="fr"` correctement posé, hiérarchie de titres cohérente (aucun saut de niveau détecté), contrastes largement conformes sur les 3 thèmes (voir annexe), gestion clavier/focus faite à la main et globalement solide (piège à focus + restitution de focus sur la modale projet et le panneau de réglages), usage large et cohérent de `prefers-reduced-motion`, aucune `div` cliquable détectée (tous les éléments interactifs s'appuient sur des éléments natifs).

---

## Détail par thématique RGAA

### 1. Images

- `app/components/atoms/VImg.vue:117-134` et `app/components/atoms/VPrismicImg.vue:33` : l'attribut `alt` est **toujours présent** dans le HTML rendu, avec priorité prop > champ Prismic > chaîne vide. Conforme au critère 1.1 (présence de l'alternative).
- **Point de vigilance éditorial** (pas un défaut de code) : rien ne garantit qu'un `alt` Prismic non renseigné soit pertinent — dépend de la saisie CMS. À intégrer dans une checklist de publication de projet plutôt que corrigé en code.
- Icônes décoratives : `app/components/atoms/VIcon.vue:11-17` pose systématiquement `aria-hidden="true"` — bonne pratique par défaut (critère 1.2).

### 3. Couleurs

Trois thèmes sombres sont définis (`app/assets/scss/variables/_themes.scss:3-22`) : `main`, `blue`, `green`. Ratios de contraste calculés (formule WCAG relative luminance) :

| Thème | Fond | Texte | Accent | Texte/Fond | Accent/Fond |
|---|---|---|---|---|---|
| main | `#151515` | `#DBE6EC` | `#E3FD41` | **14.38:1** | **15.99:1** |
| blue | `#040915` | `#b8bdd6` | `#f09042` | **10.70:1** | **8.32:1** |
| green | `#160d17` | `#69f7a6` | `#ff5252` | **14.00:1** | **5.96:1** |

Tous les ratios dépassent largement le seuil AA (4.5:1 texte normal, 3:1 UI/texte large) — la plupart atteignent le niveau AAA (7:1). Conforme critère 3.2/3.3.

Aucune information n'est portée par la couleur seule : le sélecteur de thème (`VThemeSwitcher.vue:64-73`) associe pastille de couleur **et** libellé texte. Conforme critère 3.1.

**Absence de thème clair** : les 3 variantes sont sombres. Ce n'est pas en soi un défaut RGAA (aucun critère n'impose un thème clair), mais peut être noté comme axe de confort visuel à discuter avec le client si le persona cible inclut des utilisateurs sensibles à la luminosité.

### 6. Liens

- **Écart confirmé en live** sur `/a-propos` : les liens externes (`https://www.rezo-zero.com/fr/`, `https://www.screen-club.com/`, etc., rendus par `app/components/atoms/VPrismicLink.vue:27-33`) s'ouvrent avec `target="_blank" rel="noopener noreferrer"` mais **sans aucune indication visible ou annoncée** (pas d'`aria-label`, pas de texte visuellement masqué, pas d'icône) que le lien ouvre une nouvelle fenêtre.
  - **Critère RGAA concerné : 6.2** / WCAG 3.2.5 (changement de contexte à l'initiative de l'utilisateur, prévisible).
  - **Recommandation** : ajouter un texte visuellement masqué (`visually-hidden`, classe déjà définie dans `app/assets/scss/_common.scss:24-33`) du type "(nouvelle fenêtre)" dans `VPrismicLink.vue`, conditionné à `target === '_blank'`, via une clé i18n dédiée.

### 7. Scripts (composants interactifs)

- Aucun élément interactif custom ne repose sur une `div` avec seul gestionnaire de clic — recherche exhaustive négative sur `app/components`. Tous s'appuient sur `<button>`, `<a>`/`NuxtLink`, `<input>` natifs. Conforme critère 7.1/7.3.
- **Écart** : les poignées de redimensionnement de la fenêtre modale projet (`app/components/molecules/VWindow.vue:148-153`) ne réagissent qu'à `@pointerdown` — aucune alternative clavier pour redimensionner la fenêtre.
  - **Critère RGAA concerné : 7.1/7.3** (toute fonctionnalité scriptée doit être utilisable au clavier) / WCAG 2.1.1.
  - Gravité modérée : fonctionnalité secondaire (la modale reste consultable et fermable au clavier sans redimensionnement), mais à corriger ou explicitement documenter comme non essentielle.
- Le reste de l'interactivité scriptée est solide :
  - Modale projet (`VWindow.vue:34-73`) : piège à focus fait main (cycle Tab/Shift+Tab), fermeture `Escape`, focus déplacé à l'ouverture et restitué à l'élément déclencheur à la fermeture.
  - Panneau de réglages (`VSettingModal.vue:14-19`) : même logique, `Escape` + restitution de focus.
  - Focus visible global : `*:focus-visible { outline: 2px solid ...; outline-offset: 6px; }` (`app/assets/scss/_common.scss:19-22`).
  - Animation : aucune lib JS d'animation (pas de GSAP), transitions en CSS avec `@media (prefers-reduced-motion: no-preference)` dans 9 fichiers, et un cas JS notable — `app/composables/use-page-intro.ts:46-52` utilise `usePreferredReducedMotion()` (VueUse) pour **sauter entièrement** la séquence d'intro animée si l'utilisateur préfère un mouvement réduit. Conforme critère 13.8 / WCAG 2.3.3.

### 8. Structuration de l'information

- `<html lang>` posé dynamiquement selon la locale (`app/composables/use-page-meta.ts:63-65`, injecté via `use-prismic-meta.ts:89`). Confirmé en live : `lang="fr"`. Conforme critère 8.3.
- Landmarks : `<nav>` (avec `aria-label`), lien d'évitement (`VSkipLink.vue`) vers `#main-content`. **Confirmé fonctionnel en live** — l'élément cible existe bien dans le DOM rendu (le grep statique initial était un faux négatif, probablement dû à un id posé dynamiquement côté template). Conforme critère 12.7/12.8.
- **Écart mineur** : `app/components/molecules/VSkipLink.vue:8` — `aria-label="Liens d'évitement"` est une chaîne française codée en dur, alors que le texte du lien lui-même (ligne 16) passe bien par `$t(...)`. Sans impact utilisateur tant qu'une seule langue (fr) est active, mais à corriger pour cohérence si l'anglais est activé un jour.
- **Coquille éditoriale** (hors code, dans une donnée i18n) : `i18n/locales/nuxt.fr.json:21` — `"back_to_projects.aria_label": "Retour a tous les projets"` (accent manquant sur "à"). À corriger pour la qualité de la synthèse vocale.

### 9. Présentation de l'information

- Hiérarchie de titres cohérente et sans saut de niveau sur les 4 pages organismes, avec gestion explicite du cas "un seul `<h1>` même quand une modale projet est montée par-dessus le listing" (nested routes, cf. `docs/project-modal-routing.md`) :
  - `VHomePage.vue:8-12,17-21` / `VArchivePage.vue:18-20,174-179` : titre masqué visuellement (`visually-hidden`) en `h2` quand une sous-route projet est active, sinon `h1`.
  - `VProjectPage.vue:88-93` : `<h1>` propre à la modale projet.
  - `VAboutPage.vue` : `h1` (masqué) → `h2` par section → `h3` par entrée — **confirmé en live** sur `/a-propos` (`H1: À propos` → `H2: Formations/Expériences` → `H3` par diplôme/expérience).
  - Conforme critère 9.1.
- **Point à surveiller** : le rich text Prismic libre (rendu par `app/components/atoms/VText.vue:57-62`) peut techniquement injecter des `h2`/`h3` arbitraires selon la saisie éditoriale, sans contrôle programmatique de la hiérarchie à cet endroit. À couvrir par une checklist éditoriale RGAA (ne jamais sauter un niveau de titre dans un bloc de contenu riche).
- Tableau d'archives (`VArchivePage.vue`) : `<caption class="visually-hidden">` (ligne 181), `<th scope="col">` + `aria-sort` (lignes 183-234) — bon usage des critères 5.x (tableaux) et 9.x.

### 10. Formulaires

Aucun formulaire de contact sur le site. Les seuls contrôles de saisie sont des composants d'interface :
- `VThemeSwitcher.vue:47-86` : `<fieldset>` + `<legend class="visually-hidden">` (i18n) + `<label for>` par thème + `<input type="radio">` — labellisation complète, conforme critère 11.1/11.9.
- `VColumnsInput.vue:22-40` : `<label for>` + `aria-describedby` vers une aide contextuelle — bon pattern, mais **composant actuellement désactivé** (commenté dans `VSettingModal.vue:55`), donc non exposé aux utilisateurs en l'état. Pas un écart tant qu'il reste inutilisé, mais à re-vérifier s'il est un jour réactivé.

### 12. Navigation

- Confirmé en live : liens de navigation principale (`Home` / `Archive` / `About`), lien d'évitement fonctionnel.
- **Non vérifié de façon fiable** : ordre de tabulation complet, absence de piège au clavier hors des modales (qui elles sont correctement gérées côté code, cf. thématique 7). L'outil d'automatisation utilisé pour cet audit n'a pas permis de confirmer l'avance de focus via `Tab` de façon fiable (limite technique de l'outil, pas nécessairement du site). **Recommandation : test manuel clavier complet** (Tab/Shift+Tab, Entrée, Échap) sur l'ensemble du parcours, en particulier navigation précédent/suivant projet dans la modale (`use-project-switch-direction.ts`).

---

## Recommandations priorisées

### Quick wins (correctifs de code simples)
1. Ajouter une indication "(nouvelle fenêtre)" visuellement masquée sur les liens `target="_blank"` dans `VPrismicLink.vue` (RGAA 6.2).
2. Passer l'`aria-label` de `VSkipLink.vue:8` par une clé i18n.
3. Corriger l'accent manquant dans `i18n/locales/nuxt.fr.json:21`.

### Actions structurantes
4. Ajouter une alternative clavier (ou documenter l'exclusion) pour le redimensionnement de la modale projet (`VWindow.vue`).
5. Réaliser un test manuel clavier complet (Tab/Shift+Tab/Escape) sur tout le parcours, en conditions réelles.
6. Intégrer un outillage de lint/test d'accessibilité automatisé en CI (`eslint-plugin-vuejs-accessibility` et/ou `axe-core`/`pa11y`) pour prévenir les régressions futures.
7. Ajouter une checklist RGAA au processus éditorial Prismic (alternatives textuelles d'image pertinentes, pas de saut de niveau de titre dans le rich text).

Ces recommandations sont à valider avec les référents RGAA internes de l'agence (Timothé, Manuel) avant mise en œuvre.

---

## Annexe — détail des calculs de contraste

Formule WCAG (luminance relative) appliquée aux couleurs définies dans `app/assets/scss/variables/_themes.scss:3-22` :

```
main  : texte #DBE6EC / fond #151515 → 14.38:1   |  accent #E3FD41 / fond #151515 → 15.99:1
blue  : texte #b8bdd6 / fond #040915 → 10.70:1   |  accent #f09042 / fond #040915 →  8.32:1
green : texte #69f7a6 / fond #160d17 → 14.00:1   |  accent #ff5252 / fond #160d17 →  5.96:1
```

Seuils de référence : AA texte normal ≥ 4.5:1, AA texte large/UI ≥ 3:1, AAA texte normal ≥ 7:1. Tous les couples testés dépassent le seuil AA ; seul `green` accent/fond (5.96:1) reste sous l'AAA tout en respectant largement l'AA.
