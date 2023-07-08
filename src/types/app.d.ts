import { ProjectDocument, ProjectFrameworkDocument, ProjectTagDocument, SettingsDocument } from '~~/prismicio-types'

type Theme = 'light' | 'dark' | 'accent'

type CommonContentKey = 'settings' | 'projectFrameWorks' | 'projectTags' | 'projects'

interface CommonContent {
    settings?: SettingsDocument
    projectFrameWorks?: ProjectFrameworkDocument[]
    projectTags?: ProjectTagDocument[]
    projects?: ProjectDocument[]
}

interface ProjectFilter {}
