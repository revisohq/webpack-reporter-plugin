import { stdout as singleLineLog } from 'single-line-log'
import WebpackNotifier from './webpack-notifier'
import format from './format'

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
			onFinish: (jsonStats = {}) => {
				const { errors, warnings } = format(jsonStats)
				const time = `${getTime()}: `
				const result = errors.length > 0
					? `✘ Build failed, ${pluralize(errors.length, 'error')}`
					: '✔ Build successful'
				const warningsText = warnings.length > 0
					? ', ' + pluralize(warnings.length, 'warning') + ' found.'
					: ''

				log([...errors, ...warnings, time + result + warningsText].join('\n'))

				if (useSingleLine && keepOldBuildMessages) {
					console.log('')
				}
			},
		})
	}
}
