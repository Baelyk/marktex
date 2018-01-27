const {one, all} = require('./zwitch')
const fs = require('fs-jetpack')
// const visit = require('unist-util-visit') // Find nodes based on their type
// const handlers = require('./handlers')

module.exports = createCompiler

function createCompiler (options = {}) {
  function Compiler (tree, file) {
    this.tree = tree
    this.file = file
  }

  Compiler.prototype.compile = compile
  Compiler.prototype.one = one
  Compiler.prototype.all = all

  return Compiler

  /* The control center */
  function compile () {
    let self = this
    let tree = self.tree

    fs.write('tests/third.json', tree)
    // let file = self.file
    let result = ''

    result += this.one(tree)

    if (result[0] === '\n') result = result.substr(1)
    if (result[-1] === '\n') result = result.substring(0, result.length - 1)
    // TODO: Improve this:
    if (result.indexOf('\\begin{document}') !== -1) result += '\\end{document}'

    return result
  }
}
