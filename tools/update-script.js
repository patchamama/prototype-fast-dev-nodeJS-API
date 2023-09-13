const fs = require('fs')
const path = require('path')
const { program } = require('commander')
const { mkdirSync, renameSync } = require('fs')

program
  // .option('-d, --directory <directory>', 'Base directory path')
  .option('-r, --replace <replace>', 'Text to replace with')
  // .option('-o, --output <output>', 'Output directory path for modified files')
  .parse(process.argv)

console.log(program.opts())

const baseDirectory = program.opts().directory || '.'
// const searchFor = program.opts().search || 'prototype'
let replaceWith = program.opts().replace || ''
const defaultOutputDirectory = 'OUTPUT_'
const outputDirectory =
  program.opts().output || './' + defaultOutputDirectory + replaceWith
const searchTerms = ['Prototype', 'prototype']
const excludedFiles = ['REAME.md', 'update-script.js']
const excludedDirectories = [
  'node_modules',
  'tools',
  'docs',
  '.git',
  'OUTPUT_' + replaceWith,
] // Add any other directories to exclude here

replaceWith = removeTrailingS(replaceWith)

function removeTrailingS(text) {
  text = text.trim().toLowerCase()
  if (text.endsWith('s')) {
    return text.slice(0, -1)
  } else {
    return text
  }
}

function shouldExcludeFile(filePath) {
  return excludedFiles.includes(path.basename(filePath))
}

function capitalizeFirstLetter(text) {
  // Convert the first character to uppercase
  return text.toLowerCase().charAt(0).toUpperCase() + text.slice(1)
}

function newFileName(name) {
  let tempo = name
  let captempo = ''
  for (const searchTerm of searchTerms) {
    if (searchTerm === 'Prototype' && name.includes('Prototype')) {
      captempo = capitalizeFirstLetter(replaceWith)
      tempo = name.replace(new RegExp(searchTerm, 'g'), captempo)
    } else if (name.includes('prototype')) {
      tempo = name.replace(new RegExp(searchTerm, 'g'), replaceWith)
    }
  }
  return tempo
}

function searchAndReplaceInFile(filePath, replaceWith) {
  if (shouldExcludeFile(filePath)) {
    console.log(`Excluding filePath: ${filePath}`)
    return
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}: ${err}`)
      return
    }

    let result = data
    let tempo = ''
    for (const searchTerm of searchTerms) {
      if (searchTerm === 'Prototype') {
        tempo = capitalizeFirstLetter(replaceWith)
      } else {
        tempo = replaceWith.toLowerCase()
      }
      result = result.replace(new RegExp(searchTerm, 'g'), tempo)
    }

    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err}`)
        return
      }
      console.log(`Text replaced in ${filePath}`)
    })
  })
}

function createModifiedFile(filePath) {
  // console.log(`Creating modified file for ${filePath}`)
  const relativePath = path.relative(baseDirectory, filePath)
  const modifiedFilePath = path.join(outputDirectory, relativePath)

  if (!fs.existsSync(path.dirname(modifiedFilePath))) {
    mkdirSync(path.dirname(modifiedFilePath), { recursive: true })
  }

  fs.copyFileSync(filePath, modifiedFilePath)
  console.log(`Modified file created: ${modifiedFilePath}`)

  const modifiedNewFileName = newFileName(path.basename(modifiedFilePath))
  // const extension = path.extname(modifiedFilePath)
  const newModifiedFilePath = path.join(
    path.dirname(modifiedFilePath),
    modifiedNewFileName
  )

  if (modifiedFilePath !== newModifiedFilePath) {
    renameSync(modifiedFilePath, newModifiedFilePath)
    console.log(`+++ File renamed: ${newModifiedFilePath}`)
    return newModifiedFilePath
  } else {
    return modifiedFilePath
  }
}

function shouldExcludeDirectory(directoryPath) {
  return excludedDirectories.includes(path.basename(directoryPath))
}

function searchAndReplaceInDirectory(directoryPath, replaceWith) {
  if (shouldExcludeDirectory(directoryPath)) {
    console.log(`Excluding directory: ${directoryPath}`)
    return
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directoryPath}: ${err}`)
      return
    }

    files.forEach((file) => {
      let filePath = path.join(directoryPath, file)

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${filePath}: ${err}`)
          return
        }

        if (stats.isFile()) {
          filePath = createModifiedFile(filePath)
          searchAndReplaceInFile(filePath, replaceWith)
        } else if (stats.isDirectory()) {
          searchAndReplaceInDirectory(filePath, replaceWith)
        }
      })
    })
  })
}

console.log(baseDirectory, replaceWith, outputDirectory)

if (!baseDirectory || !replaceWith || !outputDirectory) {
  console.error(
    'Please provide the required parameters. Use --help for usage information.'
  )
  process.exit(1)
}

searchAndReplaceInDirectory(baseDirectory, replaceWith)
