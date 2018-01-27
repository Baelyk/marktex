const {all} = require('./zwitch') // Handle individual nodes based on their type
const yaml = require('js-yaml')

function indent (level) {
  return '  '.repeat(level)
  // return ''
}

module.exports = {
  levels: ['', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph', 'subparagraph'],
  tableWidth: '2cm',
  tableSpec: 'p',
  /* Split a `root` node and send its individual nodes through */
  root: node => {
    return all(node).join('\n')
  },
  paragraph: node => {
    return `${all(node).join('')}\n`
  },
  blockquote: node => {
    // TODO: Handle blockquotes? (possible packages?)
  },
  heading: node => {
    return `\\${module.exports.levels[node.depth]}{${all(node).join('')}}\n`
  },
  code: node => {
    // TODO: Handle code (see LaTeX documentation for packages)
  },
  inlineCode: node => {
    // TODO: Handle inlineCode (see LaTeX documentation for packages)
  },
  yaml: node => { // Instead send the error to unknown
    /* Supported configurations:
      document: (Object) Settings to compile a full document
        author: (String) An author for the document: \author{`author`}
        date: (String) A date for the document: \date{`date`}
        class: (Object): \documentclass[`options`]{`class`}
          options: (String) Options for the document class command
          class:  (String) Class for the document class command
        packages: (Array[String or Object])
          (String): A package to use: \usepackage{`package`}
          (Object): \usepackage[`options`]{`package`}
            options: (String) Options for the package to use
            package: (String) A package to use
        other: (String) More commands to include in the preamble
        texProgram: (String) A TEX program: % !TEX program = `texProgram`
        title: (String) A title for the document, also determine if title, author, and date are rendered: \title{`title`}
      partHeading: (boolean) Use part for h1s (#)
      table: (Object) Table settings
        width: (String) Width for table cell if alignment is null
        spec: (String) Wich type of table cell if alignment is null (p, m, or b)
    */
    const config = yaml.safeLoad(node.value)
    if (config.partHeading) module.exports.levels = ['', 'part', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph']
    if (config.table) {
      if (config.table.width) module.exports.tableWidth = config.table.width
      if (config.table.spec) module.exports.tableSpec = config.table.spec
    }
    if (config.document) {
      let preamble = ''
      if (config.document.texProgram) preamble += `% !TEX program = ${config.document.texProgram}\n`
      if (config.document.class) {
        if (config.document.class.options) {
          preamble += `\\documentclass[${config.document.class.options}]{${config.document.class.class}}\n`
        } else {
          preamble += `\\documentclass{${config.document.class.class}}\n`
        }
      }
      if (config.document.packages) {
        config.document.packages.forEach(element => {
          if (typeof element === 'string') {
            preamble += `\\usepackage{${element}}\n`
          } else {
            preamble += `\\usepackage[${element.options}]{${element.package}}\n`
          }
        })
        preamble += '\n'
      }
      if (config.document.other) preamble += config.document.other + '\n\n'
      if (config.document.title) {
        preamble += `\\title{${config.document.title}}\n`
        if (config.document.author) preamble += `\\author{${config.document.author}}\n`
        if (config.document.date) preamble += `\\date{${config.document.date}}\n`
      }

      preamble += `\n\\begin{document}\n`
      if (config.document.title) preamble += `\\maketitle`
      preamble += '\n'
      return preamble
    }
  },
  /* html: node => { // Instead send the error to unknown
    throw new Error (`Unable to process HTML`)
  } */
  list: node => {
    // TODO: Find out what the `loose` property is and if I can use `start`
    if (node.ordered) {
      return `\\begin{enumerate}\n${all(node).join('')}\\end{enumerate}`
    } else {
      return `\\begin{itemize}\n${all(node).join('')}\\end{itemize}`
    }
  },
  listItem: node => {
    return `${indent(1)}\\item ${all(node).join('')}`
  },
  table: node => {
    // TODO: Handle tables
    let columns = '|'
    const align = {
      left: 'l',
      center: 'c',
      right: 'r',
      null: `${module.exports.tableSpec}{${module.exports.tableWidth}}`
    }
    node.align.forEach(element => {
      columns += ` ${align[element]} |`
    })
    return `\\begin{center}
${indent(1)}\\begin{tabular}{${columns}}
${indent(2)}\\hline
${all(node).join('\n')}
${indent(1)}\\end{tabular}
\\end{center}\n`
  },
  tableRow: node => {
    // TODO: Handle tables
    let row = indent(2)
    node.children.forEach((cell, index) => {
      if (index !== node.children.length - 1) {
        row += `${module.exports.tableCell(cell)} & `
      } else {
        row += `${module.exports.tableCell(cell)} \\\\ \\hline`
      }
    })
    return row
  },
  tableCell: node => {
    // TODO: Handle tables
    return all(node).join('')
  },
  thematicBreak: node => {
    return `\\begin{center}\n${indent(1)}\\noindent\\rule{12cm}{0.4pt}\n\\end{center}\n`
  },
  break: node => {
    // TODO: Reconsider how to do this?
    return ''
  },
  emphasis: node => {
    /* Go through the children and compile them then wrap it in a \textit */
    return `\\textit{${all(node).join('')}}`
  },
  strong: node => {
    /* Go through the children and compile them then wrap it in a \textbf */
    return `\\textbf{${all(node).join('')}}`
  },
  delete: node => {
    /* Go through the children and compile them then wrap it in a \sout */
    return `\\sout{${all(node).join('')}}`
  },
  link: node => {
    // TODO: Handle links (see LaTeX documentation for packages)
  },
  image: node => {
    /* Use the alt text as a caption and title (if exists) for label */
    return `\\begin{figure}
    ${indent(1)}\\begin{center}
    ${indent(2)}\\includegraphics{${node.url}}
    ${indent(3)}${node.alt ? `\\caption{${node.alt}}` : ''}
    ${indent(1)}${node.title ? `\\figure{${node.title}}` : ''}
    ${indent(2)}\\end{center}
    ${indent(1)}\\end{figure}`
  },
  footnote: node => {
    // TODO: Handle footnotes
  },
  linkReference: node => {
    // TODO: Handle LinkReferences
  },
  imageReference: node => {
    // TODO: Handle ImageReferences
  },
  footnoteReference: node => {
    // TODO: Handle footnotes
  },
  definition: node => {
    // TODO: Handle definitions
  },
  footnoteDefinition: node => {
    // TODO: Handle definitions
  },
  text: node => {
    return `${node.value}`
  },
  inlineMath: node => {
    if (node.data.hProperties.className === 'inlineMath inlineMathDouble') {
      return `$$ ${node.value} $$`
    } else {
      return `$${node.value}$`
    }
  },
  math: node => {
    return `$$ ${node.value} $$`
  }
}

/*
inlineCode: node => {
  return `$${node.value}$`
}
*/
