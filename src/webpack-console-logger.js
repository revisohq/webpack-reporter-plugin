import { stdout as singleLineLog } from 'single-line-log'
import WebpackNotifier from './webpack-notifier'

function getTime() {
	const now = new Date()
	return [now.getHours(), now.getMinutes(), now.getSeconds()]
		.map(num => ('0' + num).slice(-2))
		.join(':')
}

function pluralize(count, word) {
	return `${count} ${word}${count == 1 ? '' : 's'}`
}

export default class WebpackConsoleLogger extends WebpackNotifier {
	constructor({ useSingleLine = true, keepOldBuildMessages = false } = {}) {
		const log = useSingleLine
			? message => singleLineLog(message + '\n')
			: console.log.bind(console)

		super({
			onStart: () => {
				log(getTime() + ': Starting build')
			},
			onFinish: ({warnings = [], errors = []} = {}) => {
				const time = getTime()

				console.log()
				if (errors.length > 0) {
					errors.forEach(e => console.log(e))
					console.log(`${time}: Build failed, ${pluralize(errors.length, 'error')} found.`)
				} else if (warnings.length > 0) {
					warnings.forEach(w => console.log(w))
					console.log(`${time}: Build complete, ${pluralize(warnings.length, 'warning')} found.`)
				} else {
					console.log(`${time}: Built successful.`)
				}

				if (useSingleLine && keepOldBuildMessages) {
					console.log('')
				}
			},
		})
	}
}
