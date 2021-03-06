export default class WebpackNotifier {
	constructor({ onStart = ()=>{}, onFinish = (report)=>{} } = {}) {
		this.onStart = onStart
		this.onFinish = onFinish
	}

	apply(compiler) {
		let throttle = this.createThrottle()

		compiler.plugin('invalid', () => {throttle.onStart()})
		compiler.plugin('compile', () => {throttle.onStart()})
		compiler.plugin('done', stats => {
			const jsonStats = stats.toJson({}, true)
			throttle.onStop(jsonStats)
			throttle = this.createThrottle()
		})
		compiler.plugin('failed', err => {console.error('error', err)})
	}

	createThrottle() {
		let startResolver = this.createResolver()
		startResolver.promise
			.then(() => this.onStart())
			.catch(error => {
				console.error('onStart failed: ' + (error.stack || error.message || error))
				// This promise never resolves. This is on purpose
				return new Promise(() => {})
			})
		let stopResolver = this.createResolver(startResolver.promise)
		stopResolver.promise
			.then(report => this.onFinish(report))
			.catch(error => console.error('onFinish failed: ' + (error.stack || error.message || error)))
		return {
			onStart: startResolver.resolve,
			onStop: stopResolver.resolve,
		}
	}

	createResolver(inboundPromise = Promise.resolve()) {
		let resolve
		let outboundPromise = new Promise(r => {resolve = r})
		let promise = inboundPromise.then(() => outboundPromise)
		return { resolve, promise }
	}
}
