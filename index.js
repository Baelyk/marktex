const compiler = require('./lib/compiler.js')

module.exports = latex

function latex (options = {}) {
  this.Compiler = compiler(options)
}
