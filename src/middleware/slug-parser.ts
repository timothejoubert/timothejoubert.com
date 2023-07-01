import { ServerMiddleware } from '@nuxt/types'

const slugParser: ServerMiddleware = function (_req, _res, _next) {
    //     if (!req?.url) return
    //     const slugifyPath = req.url.replace(/\s+/g, '-').toLowerCase();
    //     if (slugifyPath !== req.url) return redirect(slugifyPath)
}

export default slugParser
