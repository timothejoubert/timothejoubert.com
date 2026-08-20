# Correspondance `creative_work_type` par projet

Proposition de valeur pour chaque projet, à relire avant migration. Colonne "Type" = valeur à écrire dans `creative_work_type` (`CreativeWork` sert de fallback générique quand aucun des 4 autres ne colle vraiment). Colonne "?" = cas limites à trancher toi-même, mon choix est une supposition raisonnable mais pas certaine.

| uid | Titre | Type proposé | ? | Justification courte |
|---|---|---|---|---|
| hugo-tomasi | Hugo Tomasi | **WebSite** | | déjà migré (test initial) — refonte de site, lien live |
| abra-vinum | Abra vinum | WebSite | | "Création d'un site" |
| asteria | Asteria | WebSite | | landing page agence, lien live |
| eden-home | Eden home | WebSite | | site client, lien live |
| justine-saez | Justine saez | WebSite | | portfolio client, lien live |
| pierre-david | Pierre David | WebSite | | portfolio client, lien live |
| screen-club | Screen club | WebSite | | portfolio studio, lien live |
| cmbv | CMBV | WebSite | | site client, lien live |
| centre-pompidou | Centre pompidou-Metz | WebSite | | site client, lien live |
| cmm | Cité musicale-Metz | WebSite | | site client, lien live |
| opera-de-lyon | Opéra de Lyon | WebSite | | site client, lien live |
| modelec | Modelec | WebSite | | site client, lien live |
| out-of-box | Out of box | WebSite | | portfolio agence, lien live |
| portfolio-v3 | Portfolio V3 | WebSite | | ancien portfolio perso, lien live |
| fourre-tout | Fourre tout | WebSite | | "mon portfolio actuel" — pas de lien enregistré, à confirmer si c'est bien ce site-ci |
| yourtoys | Yourtoys | WebSite | | prototype e-commerce (exercice DSAA), pas de lien — site ou plutôt SoftwareApplication ? |
| pogote-moi-cette-fonte | Pogote-moi cette fonte ! | SoftwareApplication | | outils web interactifs, lien Notion (mémoire) |
| duo-form | Duo form | CreativeWork | | design landing page + app fictive, pas de lien (mockup only) |
| boule-en-soie | Boule en soie | SoftwareApplication | | app tablette AR fictive, pas de lien |
| com-on | Com on | CreativeWork | | app mobile fictive, pas de lien |
| colors-of-africa | Colors of africa | SoftwareApplication | | expérimentation interactive, lien live |
| data-time | DataTime | SoftwareApplication | | exercice Processing |
| number-of-type | Number of type | SoftwareApplication | | programme P5.js |
| grid-moi-ca | Grid moi ça | SoftwareApplication | | programme P5.js |
| prenez-moi-en-stage | Prenez moi en stage ! | SoftwareApplication | | Codepen |
| exo-front | Exo front | WebSite | | exercice d'intégration web (1h) — plutôt outil/démo que vrai site |
| lmd-playground | LMD Playground | SoftwareApplication | | outil web interactif (jeu JPO) |
| audiome | Audiome | SoftwareApplication | | site "expérientiel et expérimental" interactif |
| webtober | Webtober | SoftwareApplication | | challenge JS (interactions) |
| 36-days-of-type | 36 days of type | SoftwareApplication | | générateur de lettres interactif |
| fontimate | Fontimate | SoftwareApplication | | outil en ligne + landing page |
| phamplet-du-graphiste | Phamplet du graphiste | VisualArtwork | | visuels expérimentaux |
| linutile | L'inutile | VisualArtwork | | couverture de magazine |
| bob-life | Bob life | VisualArtwork | | sérigraphie |
| xwing | X-wing | VisualArtwork | | modèle 3D (Blender) |
| a-guilt-routine | A guilt routine | VisualArtwork | | série photographique |
| inventaire-speleologique | Inventaire spéléologique | VisualArtwork | | fresque à l'encre de chine |
| autobiographie-video | Autobiographie video | VideoObject | | vidéo |
| alkatrine-font | Alkatrine font | VideoObject | | clip type karaoké |
| diesel-fragrance | Diesel | WebSite | | écran promo / lien nommé "asteria-video" |
| macao | Macao | WebSite | | loading screen + vidéo live embarqué |
| animer-le-confine | Animer le confiné | VideoObject | | série d'animations |
| duik-wtf | Duik wtf | VideoObject | | expérimentation motion (After Effects) |
| eclipse | Éclipse | CreativeWork | | installation physique (festival) |
| parterre-oceanique | Parterre océanique | CreativeWork | | installation immersive |
| vestige-informatique | Vestige informatique | CreativeWork | | mise en scène/installation |
| spline-u | Spline U | CreativeWork | | workshop typo, nature exacte de la sortie incertaine |
| parachute | Parachute | CreativeWork | | identité visuelle + interface web, pas de lien — WebSite ? |
| rapport-rz | Rapport RZ | CreativeWork | | document/rapport de stage |
| cest-tout-un-programme | C'est tout un programme | CreativeWork | | mémoire DSAA |

**Total : 50 projets.** Répartition : WebSite ×16, SoftwareApplication ×17, VisualArtwork ×6, VideoObject ×6, CreativeWork ×7 (dont ⚠️ 10 cas à trancher).

## Prochaine étape

Une fois ce fichier relu/corrigé (édite directement le tableau si tu veux changer une valeur), je lance la migration pour tous les projets vers l'API de Migration Prismic (brouillon dans une Migration Release, à publier manuellement après vérification — même principe que pour `hugo-tomasi`).
