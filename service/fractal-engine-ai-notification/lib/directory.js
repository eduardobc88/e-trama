const path = require('path')
const fs = require('fs')


let createFolderFromPath = (path) => {
  let arrDir = path.split('/')
  if (!arrDir)
    return

  let dirPath = ''
  for (let index in arrDir) {
    if (index === 0)
      dirPath = arrDir[index]
    else
      dirPath = `${ dirPath }/${ arrDir[index] }`
    if (dirPath[0] === '/')
      dirPath = dirPath.substring(1)
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(dirPath)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

module.exports = {
  createFolderFromPath: createFolderFromPath,
}
