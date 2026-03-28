import util from 'node:util'
import { pipeline } from 'node:stream'
const pump = util.promisify(pipeline)
import path from 'path'
import dateTime from 'node-datetime'
import sharp from 'sharp'
import fs from 'fs'

import SERVICE_CONFIG from '../config.js'
import GOOGLE_DRIVE from '../lib/google-drive.js'


const fileUpload = async (req, res) => {
  let result = {
    error: null,
    file_data: {},
  }
  try {
    let folderId = ((req.session.user.gd_folder_id === undefined || req.session.user.gd_folder_id !== '')?req.session.user.gd_folder_id:'')
    const data = await req.file()
    let newfileName = `${ dateTime.create().format('YmdHMS') }-${ data.filename }`
    let areaId = req.session.user.area_id
    let filePath = `${ SERVICE_CONFIG.uploadDirectory }${ areaId }/${ newfileName }`
    await pump(data.file, fs.createWriteStream(filePath))
    result.file_data.file_original_name = data.filename
    result.file_data.file_name = newfileName
    result.file_data.file_mime_type = data.mimetype
    result.file_data.file_size = 0
    result.file_data.file_path = filePath
    result.file_data.file_title = data.fields.file_title.value
    result.file_data.file_description = ((data.fields.file_description !== undefined)?data.fields.file_description.value:'')
    result.file_data.file_gd_file_id = ''
    if (SERVICE_CONFIG.settings.use_google_drive) {
      // NOTE: GOOGLE DRIVE FILE UPLOAD
      let service = await GOOGLE_DRIVE.getService()
      let resultFileUpload = await GOOGLE_DRIVE.uploadFile(service, gdFolderId, filePath)
      if (resultFileUpload.error !== null)
        throw resultFileUpload.error
      result.file_data.file_gd_file_id = resultFileUpload.id
    }
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const resizeImage = (destination, fileName, width, height) => {
  let sourceFilePath = `${ destination }${ fileName }`
  let fileExt = path.extname(fileName)
  let resizeFilePath = `${ destination }sizes/${ path.basename(fileName, fileExt) }-${ width }x${ height }${ fileExt }`
  return sharp(sourceFilePath)
    .resize(width, height)
    .toFile(resizeFilePath)
}


export default {
  fileUpload: fileUpload,
  resizeImage: resizeImage,
}
