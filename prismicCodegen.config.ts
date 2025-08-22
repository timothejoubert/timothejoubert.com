import type { Config } from 'prismic-ts-codegen'
import { libraries } from './slicemachine.config.json'

const config: Config = {
	output: './prismicio-types.d.ts',
	models: [
		'./customtypes/**/index.json',
		...libraries.map(path => `${path}/**/model.json`),
	],
}

export default config
