import SERVICE_CONFIG from '../config.js'

const STATIC_UPLOADS_URL = `${ SERVICE_CONFIG.staticUploadPathPrefix }/upload/`
const STATIC_UPLOADS_SIZES_URL = `${ SERVICE_CONFIG.staticUploadPathPrefix }/upload/sizes`


const getHexColorFromString = (str) => {
  let hash = 5
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const getImageURL = (fileName, Size) => {
  if (!fileName)
    return ''

  let url = ''
  let fileNameArray = fileName.split('.')
  if (Size)
    url = `${ STATIC_UPLOADS_SIZES_URL }${ fileNameArray.shift() }-${ Size }.${ fileNameArray.pop() }`
  else
    url = `${ STATIC_UPLOADS_URL }${ fileName }`
  return url
}


export default {
  getHexColorFromString: getHexColorFromString,
  getImageURL: getImageURL,
}
