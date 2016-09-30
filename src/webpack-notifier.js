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
			const { errors, warnings } = stats.compilation
			throttle.onStop({ warnings, errors })
			throttle = this.createThrottle()
		})
		compiler.plugin('failed', err => {console.error('error', err)})
	}

	createThrottle() {
		let startResolver = this.createResolver()
		startResolver.promise.then(() => this.onStart())
		let stopResolver = this.createResolver(startResolver.promise)
		stopResolver.promise.then(report => this.onFinish(report))
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
