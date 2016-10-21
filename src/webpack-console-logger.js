import { stdout as singleLineLog } from 'single-line-log'

import WebpackNotifier from './webpack-notifier'
import format from './format'

function getTime() {
	var now = new Date();
	return [now.getHours(), now.getMinutes(), now.getSeconds()]
		.map(function(num) {
			return ('0' + num).slice(-2);
		})
		.join(':');
}

function pluralize(count, word) {
	return `${count} ${word}${count == 1 ? '' : 's'}`
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
					...format(warnings),
					...format(errors),
					`Webpack finished. ${pluralize(warnings.length, 'warning')}, ${pluralize(errors.length, 'error')}`,
				].map(x => x.trim()).filter(x => x.length > 0)
				log(lines.map(x => `${getTime()}: ${x}`).join('\n'))
				if(useSingleLine && keepOldBuildMessages) {
					console.log('')
				}
			},
		})
	}
}
