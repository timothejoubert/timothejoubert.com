<template>
    <div :class="$style.root">
        <div>Length: {{ projects.length }}</div>
        <ul>
            <li v-for="(value, key) in tagUsage" :key="key">{{ key }}:{{ value }}</li>
        </ul>
        <ul>
            <li v-for="(value, key) in dateUsage" :key="key">{{ key }}:{{ value }}</li>
        </ul>
        <ul>
            <li v-for="(value, key) in frameworkUsage" :key="key">{{ key }}:{{ value }}</li>
        </ul>
        <div>rate: {{ rate }}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getTags } from '~/utils/tags'
import { ProjectDocument } from '~~/prismicio-types'
import { getProjectYear } from '~/utils/prismic/date'

type LengthByKey = { [key: string]: number }

export default Vue.extend({
    name: 'VStatistic',
    computed: {
        projects(): ProjectDocument[] {
            return this.$store.getters.projects
        },
        tags(): string[][] {
            return this.projects.map(({ data }: ProjectDocument) => {
                return getTags(data).map((tag) => tag.label)
            })
        },
        tagUsage(): LengthByKey {
            return this.getKeyUsage(this.tags)
        },
        dateUsage(): LengthByKey {
            const dates = this.projects.map((p) => getProjectYear(p.data.date).toString())
            return this.getKeyUsage(dates)
        },
        frameworkUsage(): LengthByKey {
            const frameworks = this.projects.map((p) => p.data.framework) as string[]
            return this.getKeyUsage(frameworks)
        },
        rate(): LengthByKey {
            const rates = this.projects.map((p) => p.data.rate).filter((rate) => typeof rate === 'number') as number[]
            const average = rates.reduce((acc, current) => (acc += current), 0) / rates.length - 1
            const median = rates[Math.floor(rates.length / 2)]
            return { median, average }
        },
    },
    methods: {
        getKeyUsage(list: (string | string[])[]): LengthByKey {
            return list.reduce((acc: LengthByKey, itemContent: string | string[]) => {
                const itemArray = Array.isArray(itemContent) ? itemContent : [itemContent]

                itemArray.forEach((itemContent) => {
                    if ((Object as any).hasOwn(acc, itemContent)) acc[itemContent] = acc[itemContent] + 1
                    else acc[itemContent] = 1
                })

                return acc
            }, {})
        },
    },
})
</script>

<style lang="scss" module>
.root {
}
</style>
