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

		it('should not call any of the handlers', () => {
			return new Promise(resolve => {
				setTimeout(resolve, 10)
			}).then(()=>{
				expect(testData.onStart).to.not.have.been.called
				expect(testData.onFinish).to.not.have.been.called
			})
		})

		describe('and emitting `invalid` event', () => {
			it('should call the `onStart` handler', done => {
				testData.onStart.calls(done)
				testData.compilerEvents.emit('invalid')
			})
		})

		describe('and emitting `compile` event', () => {
			it('should call the `onStart` handler', done => {
				testData.onStart.calls(done)
				testData.compilerEvents.emit('compile')
			})
		})
	})
})
