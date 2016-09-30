import EventListener from 'events'
import { WebpackNotifier } from '../index'

describe('webpack-notifier.js', () => {
	let testData
	beforeEach(() => {
		const compilerEvents = new EventListener()
		testData = {
			onStart: fzkes.fake('onStart'),
			onFinish: fzkes.fake('onFinish'),
			compilerEvents,
			compiler: {
				plugin: fzkes.fake('compiler.plugin').calls((name, fn) => compilerEvents.on(name, fn)),
			},
		}
	})
	describe('Creating notifier', () => {
		beforeEach(() => {
			const { onStart, onFinish } = testData
			testData.notifier = new WebpackNotifier({ onStart, onFinish })
			testData.notifier.apply(testData.compiler)
		})

		;['invalid', 'compile', 'done'].forEach(event => {
			it(`should add a listener for the \`${event}\` event`, () => {
				expect(testData.compiler.plugin).to.have.been.calledWith(event)
			})
		})
	})
})
