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

```js
// An easy and opiniated way to set up the reporter.
export class WebpackConsoleLogger {
	constructor({ useSingleLine = true })
}

// A customizable way of setting up the reporter. The callbacks are called
// at the appropriate time in the Webpack build lifecycle.
export class WebpackNotifier {
	constructor({ onStart = ()=>{}, onFinish = ({ warnings, errors }) => {} })
}

// An easy and opiniated way of formatting the errors and warnings that the
// `WebpackNotifier` passes on to the `onFinish` callback.
// It returns a list of pre-formatted strings.
export function format(list)
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
			onFinish: ({ warnings, errors }) => {
				// Turns the list of warnings and errors into a list of formatted strings
				log(`webpack finished`, { warnings: format(warnings), errors: format(errors) })
			},
		}),
	],
	...
}
```
