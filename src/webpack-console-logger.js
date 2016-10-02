import { stdout as singleLineLog } from 'single-line-log'

import WebpackNotifier from './webpack-notifier'

function getTime() {
	var now = new Date();
	return [now.getHours(), now.getMinutes(), now.getSeconds()]
		.map(function(num) {
			return ('0' + num).slice(-2);
		})
		.join(':');
}

export default class WebpackConsoleLogger extends WebpackNotifier {
	constructor({ useSingleLine = true, keepOldBuildMessages = false } = {}) {
		const log = useSingleLine ? message => singleLineLog(message + '\n') : console.log.bind(console)

		super({
			onStart: () => {
				log(getTime() + ': Starting build')
			},
			onFinish: ({ warnings = [], errors = [] } = {}) => {
				let lines = [
					formattedErrors,
					`Webpack finished. ${warnings.length} warning(s), ${errors.length} error(s)`,
				]
				log(lines.map(x => `${getTime()}: ${x}`).join('\n'))
				if(useSingleLine && keepOldBuildMessages) {
					console.log('')
				}
			},
		})
	}
}
