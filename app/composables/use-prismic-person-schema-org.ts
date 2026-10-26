import { asText, isFilled } from '@prismicio/client'
import { callWithNuxt } from '#app'
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'
import { ensureProtocol } from '~/utils/url'

/**
 * Global schema.org `Person` node, sourced from the `settings` singleton (contact/socials) and
 * the `about` singleton (formations/experiences) — fetched here (not just on the about page) so
 * these facts are present in the JSON-LD graph on every page; a LLM reading only the JSON-LD
 * shouldn't have to visit /a-propos first.
 */
export async function usePrismicPersonSchemaOrg() {
    // Nuxt/Vue composables below need the current instance context (`inject()` etc.) — captured
    // before the first await, since awaiting inside a composable that lives outside app.vue's own
    // <script setup> isn't rewritten by the SFC compiler to restore that context automatically the
    // way a top-level await written directly in setup() would be. Only the very first await gets
    // away with it here; every composable call after that needs `callWithNuxt` explicitly.
    const nuxtApp = useNuxtApp()

    const { data: settings } = await usePrismicSettingsDocument()
    const publisher = computed(() => settings.value?.data)

    const { data: about } = await callWithNuxt(nuxtApp, () => usePrismicAboutDocument())
    const aboutData = computed(() => about.value?.data)

    // Field shape (about custom type): `title` is the diploma name, `content` is the school
    // (free text), `place` is the city — e.g. title="Master 2 - Direction artistique",
    // content="Faculté Lyon 2", place="Bron".
    const alumniOf = computed(() => {
        return aboutData.value?.formations
            ?.map(formation => asText(formation.content) || formation.title)
            .filter((name): name is string => !!name)
            .map(name => ({ '@type': 'EducationalOrganization', name }))
    })

    // The about page's intro only: schema.org has no standard property for a full work history on
    // a `Person`, and folding experiences into this text made it an unreadable list of companies.
    // Experiences stay on /a-propos, linked to this node through its `ProfilePage`.
    const description = computed(() => asText(aboutData.value?.content) || undefined)

    // The Prismic link can be typed without a scheme (`timothejoubert.netlify.app`), which isn't a valid schema.org URL
    const publisherUrl = getFilledLinkToWeb(publisher.value?.publisher_url)?.url

    callWithNuxt(nuxtApp, () => useSchemaOrg([
        definePerson({
            name: publisher.value?.publisher_name || undefined,
            description: description.value,
            url: publisherUrl ? ensureProtocol(publisherUrl) : undefined,
            image: isFilled.image(publisher.value?.publisher_image) ? publisher.value.publisher_image.url : undefined,
            email: publisher.value?.email || undefined,
            jobTitle: publisher.value?.publisher_job_title || undefined,
            worksFor: publisher.value?.publisher_work_for ? { '@type': 'Organization', 'name': publisher.value.publisher_work_for } : undefined,
            alumniOf: alumniOf.value,
            sameAs: publisher.value?.socials
                .map(({ link }) => getFilledLinkToWeb(link)?.url)
                .filter((url): url is string => !!url),
        }),
    ]))
}
