import { createClient, filter } from '@prismicio/client'
import { getRoutePath, prismicDocumentType } from './prismic-schema'

/**
 * Favorite projects used to live at the bare `/:uid` path before moving to `/projets/:uid`.
 * Recomputed from Prismic's current favorite set on every build (not a frozen list) — a project
 * that never existed at the old path still gets a harmless, unused redirect rule.
 */
export async function getLegacyFavoriteProjectRedirects(repositoryName: string): Promise<Record<string, { redirect: { to: string, statusCode: 301 } }>> {
	const client = createClient(repositoryName)

	const favoriteProjects = await client.getAllByType(prismicDocumentType.PROJECT_PAGE, {
		filters: [filter.at('my.project.favorite', true)],
	})

	return Object.fromEntries(
		favoriteProjects.map(doc => [`/${doc.uid}`, { redirect: { to: getRoutePath('projet', { uid: doc.uid }), statusCode: 301 as const } }]),
	)
}
