### Prismic type in generated ts

```` javascript
import type * as prismic from '@prismicio/types'
import { ApiOptions } from '@prismicio/client/types/Api'
import { Document } from '@prismicio/client/types/documents'

(repositoryNameOrEndpoint: string, options?: ApiOptions): Promise<Document<AllDocumentTypes>>
````

### IN PROGRESS
** (LeaveScreen): Create visual when blur tab 
** (SplashScreen): start loading if currently on tab

### TODOS
** (VSplashScreen): quick loader when splashScreen is disabled | alreadyDone  
** (ProjectTransition): when project switching 
** (VMedia): Allow Embed video media
** (VSetting): adapt height

### DONE
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

### TO CHECK

### LATER 
** (Image): optimize img size and use of ratio
* **(Route)** Set relationLink field in BO if we want nested route (projects/project-name)
* **(Build)** Generate.exclude not working
* **(Sitemap && routes)** avoid to generate route for ['/preview', '/en/preview', '/en/slice-simulator', '/slice-simulator']
* **(Nav)**: Configure nested route
* **(Config)** check if I can make Internalization route path (update documentUid vars by currentLocale ?)
* **(Prismic)** use new Page type
* **(Config)** use PrismicClient (exemple)[https://community.prismic.io/t/an-invalid-prismic-repository-name-was-given/10523/10]

### ABANDONED
** (VSetting): Display only tag with current project (if only best project remove unused tags)
** (Setting): keep alive component
** (VCard): add infinite marquee for tags ? 
