import type {SettingsDocument} from "~/prismicio-types";

const key = 'settings-document'
export async function usePrismicSettingsDocument() {
    const cachedData = useNuxtData<SettingsDocument>(key)

    const { data } = cachedData.data.value
        ? cachedData
        : await useAsyncData(key, async () => {
            const prismicClient = usePrismic().client

            return await prismicClient.getSingle('settings')
        })

    return data
}
