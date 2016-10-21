webpack-reporter-plugin
=======================

A simple lifecycle reporter plugin for Webpack.


Usage
-----

### The easy way

```js
import { WebpackConsoleLogger } from 'webpack-reporter-plugin'

const webpackConfig = {
	...
	plugins = [
		new WebpackConsoleLogger({ useSingleLine: true }),
	],
	...
}
```

### The customizable way

```js
import { WebpackNotifier, formatErrors } from 'webpack-reporter-plugin'

const webpackConfig = {
	...
	plugins = [
		new WebpackNotifier({
			onStart: () => {
				log('webpack started building')
			},
			onFinish: ({ warnings, errors }) => {
				// Turns the list of errors into a list of formatted strings
				let formattedErrors = formatErrors(errors)

				log(`webpack finished`, { warnings, formattedErrors })
			},
		}),
	],
	...
}
```