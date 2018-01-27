const zwitch = require('zwitch') // Handle individual nodes based on their type
const mapz = require('mapz') // Parse the whole tree and give it individually to nodes
// const handlers = require('./handlers')

const one = zwitch('type') // Process an individual node
const all = mapz(one, { // Process a tree into `one`
  key: 'children',
  indices: false
})

module.exports.all = all

one.invalid = invalid
one.unknown = unknown
one.handlers = require('./handlers')

/* Node doesn't have a type property */
function invalid (node) {
  throw new Error(`Expected node, not '${node}'`)
}

/* Node has an unhandled type property */
function unknown (node) {
  console.log(`Cannot compile '${node.type}' node`)
}

module.exports.one = one
// module.exports.all = all
