const unified = require('unified')
const markdown = require('remark-parse')
const remarktex = require('./remark-latex.js')
const fs = require('fs-jetpack')

const processor = unified()
  .use(markdown, {commonmark: true})
  .use(remarktex)
  .process(fs.read('tests/first.md'), (error, file) => {
    if (error) throw error
    console.log(String(file))
  })

const file = fs.read('tests/first.md')

// fs.write('tests/first.json', processor.parse(file))
