const unified = require('unified')
const markdown = require('remark-parse')
const fs = require('fs-jetpack')

const processor = unified()
  .use(markdown, {commonmark: true})

const file = fs.read('tests/first.md')

fs.write('tests/first.json', processor.parse(file))
