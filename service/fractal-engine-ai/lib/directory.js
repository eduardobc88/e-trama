import FS from 'fs'


const create = path => {
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
    if (!FS.existsSync(dirPath)) {
      try {
        FS.mkdirSync(dirPath)
      } catch (err) {
        console.error(err)
      }
    }
  }
}


export default {
  create: create,
}
