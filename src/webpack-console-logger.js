//import WebpackNotifier from './webpack-notifier'
const WebpackNotifier = require('./webpack-notifier')

module.exports = /*export default */class WebpackConsoleLogger extends WebpackNotifier {
	constructor() {
		super({
			onStart: () => {
				console.log('Starting build')
			},
			onFinish: ({ warnings = [], errors = [] } = {}) => {
				console.log(`Build finished. ${warnings.length} warning(s), ${errors.length} error(s)`)
			},
		})
	}
}
