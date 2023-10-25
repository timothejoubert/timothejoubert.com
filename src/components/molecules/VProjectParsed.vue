<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProjectDocumentData, ProjectDocumentDataAwardsItem } from '~~/prismicio-types'
import { getProjectYear } from '~/utils/prismic/date'
import { getTags } from '~/utils/tags'
import { isLinkFieldFulled } from '~/utils/prismic/relation-field'

export function getAwards(project: ProjectDocumentData): ProjectDocumentDataAwardsItem[] {
    return project.awards?.filter((award) => award.name || award.type || isLinkFieldFulled(award.link))
}

export default Vue.extend({
    name: 'VProjectParsed',
    functional: true,
    props: {
        project: Object as PropType<ProjectDocumentData>,
    },
    render(_createElement, context): any {
        // Don't find what is return type of scopedSlot
        const { title, date, link, link_label, content, framework, favorite, short_description, rate } =
            context.props.project

        const tags = getTags(context.props.project)
        const tagsString = tags?.reduce((acc, tag, i) => {
            return (acc += tag.label + (i === tags.length - 1 ? '' : ' | '))
        }, '')

        return context.scopedSlots.default?.({
            title,
            awards: getAwards(context.props.project),
            rate: rate || 0,
            tags,
            parsedTags: tagsString,
            framework: framework || undefined,
            date: getProjectYear(date),
            excerpt: short_description,
            content,
            link: (link as { url?: string })?.url,
            linkLabel: link_label,
            favorite,
        })
    },
})
</script>
