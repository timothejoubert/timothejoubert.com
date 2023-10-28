### Prismic type in generated ts

```` javascript
import type * as prismic from '@prismicio/types'
import { ApiOptions } from '@prismicio/client/types/Api'
import { Document } from '@prismicio/client/types/documents'

(repositoryNameOrEndpoint: string, options?: ApiOptions): Promise<Document<AllDocumentTypes>>
````

### IN PROGRESS
** (Project: Pogote moi): Vérifier access notion 
** (Responsive): better card on mobile 
** (Responsive): ColorSwitcher popover ? (popover)

### TODOS 
** (Perf): VInteractiveText mousemove values not reset on resize 

### IMPROVEMENT
** (Font): Compress fontFile(noi) 
** (Analytic): Ajouter analytic ? matomo / notion ?
** (PreProd): Ne pas build les pages inutiles (/preview, /en, /en/slice-simulator)
** (SEO): Check headings
** (Content): check for better media quality | Animer le confiné 1ere video
** (CMS field on VMedia): Display controls or sound on videoMedia  
** (SEO): Text alt des img
** (SEO): Sitemap
** (Video): add loader and aspect ratio
** (Improvement): Ajouter data visualisation sur des projets (la typologie la plus féquente, pourcentage des frameworks, note moyenne, note mediane, projets par année, année la plus productive, ) 
** (Improvement): Ajouter les technologies utilisées en Dev. 
** (Archive): highlight title letter on input search (js => reformat text with div wrapper )
** (JsonLD): Better projects data 

### DONE
** (VArchive): Changer de projet avec les fleches
** (Varchive): set text Opacity to 1 on hover
** (Backup): Faire backup (last: 16-10-2023)
** (PreProd): redirection route ancien site (netlify)
** (organization): clean unused code
** (Responsive): Setting | Project | About
** (VArchive): Clean integration and responsive
** (Hover): Logo
** (Accessibility): aria attributre split-word-letter 
** (404): Integration Page
** (PreProd): disable referencement / deploy netlify / webHook prismic 
** (Archive): add rate order
** (Project): finish expanded style
** (VTopSetting): filter tags by existing tag in promote project
** (MainProjects): keep not filtered project but blur them
** (VSetting): Dynamic height
** (VSetting): Bug, selected tag enable visibility of not best project
** (SplashScreen): Quick load visible on first connexion
** (VSplashScreen): quick loader when splashScreen is disabled | alreadyDone  
** (LeaveScreen): Create visual when blur tab 
** (SplashScreen): start loading if currently on tab
** (VSetting): hover title and reset
** (VSetting): Add pill when filter is filled
** (Fetch): See only favorite (Filter project fetch if setting type favorite enable and remove Favorite filter)
** (SplashScreen): add component 
** (VProject): scroll Top when change project route
** (SCSS): use map-to-props from boegli for transition mixin
** (VCollapsed): Create component
** (VProject): VNew pill
** (VProject): Desciption du projets + reflexion et recul autour du projet
** (VButton): set background and color with css var depending on props theme 
** (VAbout): Reveal transition
** (Image): optimize img size and use of ratio
* **(Prismic)** use new Page type

### NEXT PROJECT 
* **(Data)**: Simplify stored fetch api data (ex: tags in project)
* **(Route & Internalization)** check if I can make Internalization route path (update documentUid vars by currentLocale ?)
* **(Route)**: Configure nested route (Set relationLink field in BO if we want nested route (projects/project-name))

### ABANDONED
* **(Sitemap && routes)** avoid to generate route for ['/preview', '/en/preview', '/en/slice-simulator', '/slice-simulator'] (Generate.exclude not working)
** (ProjectTransition): when project switching ?
** (Setting): display filter only when all project are displayed ? Unique Tag search ?
** (ProjectList): empty bottom space when setting is closed
* **(Config)** use PrismicClient (exemple)[https://community.prismic.io/t/an-invalid-prismic-repository-name-was-given/10523/10]
** (VSetting): Display only tag with current project (if only best project remove unused tags)
** (Setting): keep alive component
** (VCard): add infinite marquee for tags ? 
