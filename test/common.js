import chai from 'chai'
import fzkes from 'fzkes'

global.expect = chai.expect

global.fzkes = fzkes
chai.use(fzkes)
