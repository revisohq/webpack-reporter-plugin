import relativizeFilename from './relativize-filename'

export default function(errors) {
	return errors
		.map(x => {
			let message = x.message
			let file = x.module.userRequest
			let relativeFilename = relativizeFilename(file)
			return `${message}\n  in ${relativeFilename}`
		})
}
