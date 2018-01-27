const visit = require('unist-util-visit')
const fs = require('fs-jetpack')

function compiler (node, file) {
  console.log('hi')
  // Headers
  visit(node, 'heading', node => {
    console.log('node.depth')
    const depth = ['', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph']

    fs.write('test.txt', `\\${depth[node.depth]}{${node.children[0].value}}`)
  })
}

module.exports = plugin
function plugin () {
  this.Compiler = compiler
}
