# Prismic nuxt portfolio starter

### CONFIG

### LOCAL SETUP
* Clone skeleton project [Nuxt | Prismic starter](https://github.com/timothejoubert/nuxt-prismic-skeleton)
* Update .env file from .sample.env (PRISMIC_REPOSITORY_NAME)
* Init Slice machine in local (npx @slicemachine/init@latest)
* Push on your github repo
* Sync slice_model data on prismic repo from local slice machine

### PREPROD ON NETLIFY
* Login in your Netlify account
* Sync your github repo
* Customize your domain name
* Add your environment variables in "site settings" or import your .env file

### WEBHOOK
* Add the generated netlify url webhook in prismic settings [Prismic tuto](https://prismic.io/docs/webhooks) | [Netlify build hook page](https://app.netlify.com/sites/hugo-tomasi/settings/deploys#build-hooks)

### PREVIEW
* Setup preview in prismic setting BO (add name, domain and path to the preview in prismic settings)
* Add the cdn link in header script and the preview path url in nuxt.config.js
```
script: [
    {
        src: `https://static.cdn.prismic.io/prismic.js?new=true&repo=${process.env.PRISMIC_REPOSITORY_NAME}`,
        defer: true,
    },
],
prismic: {
    preview: process.env.PREVIEW_PATH
}
```

### REDIRECTION
* Create netlify.toml file in static folder with specific rules (Netlify tuto)[https://docs.netlify.com/routing/redirects/]
