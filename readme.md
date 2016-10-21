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

Note: If the webpack CLI is used, then it also logs the results. This can be
avoided by running webpack through node:

- `webpack` --> `node -e "require('webpack')(require('./webpack.config'), function(){})"`
- `webpack --watch` --> `node -e "require('webpack')(require('./webpack.config')).watch({}, function(){})"`
