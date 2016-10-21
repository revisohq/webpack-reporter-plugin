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
import { WebpackNotifier, format } from 'webpack-reporter-plugin'

const webpackConfig = {
	...
	plugins = [
		new WebpackNotifier({
			onStart: () => {
				log('webpack started building')
			},
			onFinish: ({ warnings, errors }) => {
				// Turns the list of warnings and errors into a list of formatted strings
				log(`webpack finished`, { format(warnings), format(errors) })
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
