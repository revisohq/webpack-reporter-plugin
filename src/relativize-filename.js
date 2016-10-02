import path from 'path'

let m = module
while(m.parent != null) {
	m = m.parent
}

let initialFile = m.filename
let rootDir = path.dirname(initialFile)


export default function(currentFile) {
	let relativePath = path.relative(rootDir, currentFile)
	return relativePath
}
