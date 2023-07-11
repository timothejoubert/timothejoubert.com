<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { getTagsByReference } from '~/utils/project/tag'
import { ProjectDocumentData } from '~~/prismicio-types'
import { getProjectYear } from '~/utils/prismic/date'

export default Vue.extend({
    name: 'VProjectParsed',
    functional: true,
    props: {
        project: Object as PropType<ProjectDocumentData>,
    },
    render(_createElement, context): undefined | VNode[] {
        const { tags, date, link, link_label, content, framework, favorite } = context.props.project

        return context.scopedSlots.default?.({
            tags: getTagsByReference(tags, context.parent.$store.getters.projectTags),
            framework: context.parent.$store.getters.getFramework((framework as { uid?: string })?.uid),
            date: getProjectYear(date),
            content,
            link: (link as { url?: string })?.url,
            linkLabel: link_label,
            favorite,
        })
    },
})
</script>
