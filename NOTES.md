### Prismic type in generated ts

```` javascript
import type * as prismic from '@prismicio/types'
import { ApiOptions } from '@prismicio/client/types/Api'
import { Document } from '@prismicio/client/types/documents'

(repositoryNameOrEndpoint: string, options?: ApiOptions): Promise<Document<AllDocumentTypes>>
````

### IN PROGRESS
** (MainProjects): keep not filtered project but blur them
** (organization): clean unused code

** (Responsive): Setting | Project | About
** (ProjectList): empty bottom space when setting is closed 
** (Setting): display filter only when all project are displayed ? Unique Tag search ?
** (VSetting): Check VInteractiveText listener on resize 

### TODOS
** (ProjectTransition): when project switching ?
** (Back & VMedia): Allow Embed video media | display controls on mp4 video  

### DONE
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

### LATER 
* **(Route & Internalization)** check if I can make Internalization route path (update documentUid vars by currentLocale ?)
* **(Route)**: Configure nested route (Set relationLink field in BO if we want nested route (projects/project-name))
* **(Sitemap && routes)** avoid to generate route for ['/preview', '/en/preview', '/en/slice-simulator', '/slice-simulator'] (Generate.exclude not working)

### ABANDONED
* **(Config)** use PrismicClient (exemple)[https://community.prismic.io/t/an-invalid-prismic-repository-name-was-given/10523/10]
** (VSetting): Display only tag with current project (if only best project remove unused tags)
** (Setting): keep alive component
** (VCard): add infinite marquee for tags ? 
