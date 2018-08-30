webpack-reporter-plugin
=======================

A simple lifecycle reporter plugin for Webpack. Unlike the standard ways of using
Webpack, this plugin logs not only the result, but also when the build starts.
This is especially useful for those big builds that take more than 10s.

Note: If the webpack CLI is used, then it also logs the results. This can be
avoided by running webpack through node:

- `webpack` --> `node -e "require('webpack')(require('./webpack.config'), function(){})"`
- `webpack --watch` --> `node -e "require('webpack')(require('./webpack.config')).watch({}, function(){})"`


Usage
-----

### Interface

`WebpackNotifier` exports [webpack stats](https://webpack.js.org/api/stats/),
its content is available through the `onFinish` callback.

```js
// An easy and opiniated way to set up the reporter.
export class WebpackConsoleLogger {
	constructor({ useSingleLine = true })
}

// A customizable way of setting up the reporter. The callbacks are called
// at the appropriate time in the Webpack build lifecycle.
export class WebpackNotifier {
	constructor({ onStart = ()=>{}, onFinish = (jsonWebpackStats) => {} })
}

// An easy and opiniated way of formatting the errors and warnings that the
// `WebpackNotifier` passes on to the `onFinish` callback.
// It returns a list of pre-formatted strings.
export function format(jsonWebpackStats)
```


### The easy way (WebpackConsoleLogger)

```js
import { WebpackConsoleLogger } from 'webpack-reporter-plugin'
// or
const WebpackConsoleLogger = require('webpack-reporter-plugin').WebpackConsoleLogger

const webpackConfig = {
	...
	plugins = [
		new WebpackConsoleLogger(),
	],
	...
}
```

The `WebpackConsoleLogger` constructor can take an options object:

- `useSingleLine`: Reuses the same line for all messages. If something else is
also writing to stdout, the line-reuse breaks apart. Defaults to `true`.

```js
const webpackConfig = {
	...
	plugins = [
		new WebpackConsoleLogger({ useSingleLine: false }),
	],
	...
}
```


### The customizable way (WebpackNotifier + format)

```js
import { WebpackNotifier, format } from 'webpack-reporter-plugin'
// or
const { WebpackNotifier, format } = require('webpack-reporter-plugin')

const webpackConfig = {
	...
	plugins = [
		new WebpackNotifier({
			onStart: () => {
				log('webpack started building')
			},
			onFinish: (jsonWebpackStats) => {
				// Turns the list of warnings and errors into a list of formatted strings
				const { warnings, errors } = format(jsonWebpackStats)
				log(`webpack finished`, { warnings, errors })
			},
		}),
	],
	...
}
```

Migrating from v1 to v2
-----------------------

There are some breaking changes to the way that the `onFinish()` function works. The upgrade-path is quite minor though:

*Old code*:
```js
onFinish({ warnings = [], errors = [] }) {
  const formattedWarnings = format(warnings)
  const formattedErrors = format(errors)
  ... use the formatted data
}
```

*New code*:
```js
onFinish(stats) {
  const { warnings, errors } = format(stats)
  ... use the formatted data
}
```
