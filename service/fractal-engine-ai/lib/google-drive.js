import fs from 'fs'
import {
  GoogleAuth,
} from 'google-auth-library'
import {
  google,
} from 'googleapis'
import SERVICE_CONFIG from '../config.js'


// NOTE: USE EXAMPLE CODE
//import GOOGLE_DRIVE from './lib/google-drive.js'


const getService = async () => {
  let auth = new GoogleAuth({
    credentials: {
      client_email: SERVICE_CONFIG.settings.gd_auth_client_email,
      private_key: SERVICE_CONFIG.settings.gd_auth_private_key.split(String.raw`\n`).join('\n'),
    },
    scopes: 'https://www.googleapis.com/auth/drive',
  })
  let service = await google.drive({
    version: 'v3',
    auth,
  })
  return service
}

const getListFolder = async (service = null, parentFolderId = '') => {
  let result = {
    files: [],
    error: null,
  }
  let listParams = {
    pageSize: 100,
    fields: 'nextPageToken, files(id, name, trashed)',
    q: `'${ SERVICE_CONFIG.settings.gd_folder_id }' in parents`,
  }
  if (parentFolderId !== '')
    listParams.q = `'${ parentFolderId }' in parents`
  try {
    let resultRequest = await service.files.list(listParams)
    if (resultRequest.status !== 200)
      throw 'error'
    result.files = resultRequest.data.files
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const createFolder = async (service = null, parentFolderId = '', folderName = '') => {
  let result = {
    id: '',
    error: null,
  }
  let fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [SERVICE_CONFIG.settings.gd_folder_id],
  }
  if (parentFolderId !== '')
    fileMetadata.parents = [parentFolderId]
  try {
    let resultRequest = await service.files.create({
      resource: fileMetadata,
      fields: 'id,name,starred,shared,permissions(kind,type,role)',
    })
    if (resultRequest.status !== 200)
      throw 'error'
    result.id = resultRequest.data.id
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const getDirectory = async (service = null, directoryName = '') => {
  let list = null
  try {
    let files = await service.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
      q: `'${ SERVICE_CONFIG.settings.gd_folder_id }' in parents`
    })
    list = files.data
  } catch (err) {
    console.error('== getDirectory ==', err)
  } finally {
    return list.files
  }
}

const uploadFile = async (service = null, parentFolderId = '', filePath = '') => {
  let result = {
    id: '',
    error: null,
  }
  let fileName = filePath.split('/').pop()
  let resource = {
    name: fileName,
    uploadType: 'media',
    parents: [SERVICE_CONFIG.settings.gd_folder_id],
  }
  if (parentFolderId !== '')
    resource.parents = [parentFolderId]
  let media = {
    body: fs.createReadStream(filePath),
  }
  try {
    let resultRequest = await service.files.create({
      fields: 'id',
      resource: resource,
      media: media,
    })
    if (resultRequest.status !== 200)
      throw 'error'
    result.id = resultRequest.data.id
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const deleteFile = async (service, fileId) => {
  let result = {
    id: fileId,
    error: null,
  }
  try {
    let response = await service.files.update({
      fileId: fileId,
      requestBody: {
        trashed: true,
      },
    })
    if (response.status !== 200)
      throw 'error deleting file'
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const getFile = async (service, parentFolderId, downloadPath, fileId) => {
  let result = {
    id: fileId,
    name: '',
    error: null,
  }
  try {
    let requestParams = {
      fileId: fileId,
      fields: 'id,name,trashed',
      parents: [SERVICE_CONFIG.settings.gd_folder_id],
      spaces: 'drive',
    }
    if (parentFolderId !== '')
      requestParams.parents = [parentFolderId]
    let resultGetFile = await service.files.get(requestParams)
    if (resultGetFile.status !== 200 || resultGetFile.data.trashed)
      throw 'file not found'
    let fileStream = fs.createWriteStream(`${ downloadPath }${ resultGetFile.data.name }`)
    let requestDownloadFile = await service.files.get({
      fileId: fileId,
      alt: 'media',
    }, {
        responseType: 'stream',
      }
    )
//    requestDownloadFile.data.on('end', () => console.log('onCompleted'))
    await requestDownloadFile.data.pipe(fileStream)
    if (requestDownloadFile.status !== 200)
      throw 'error'
    result.name = resultGetFile.data.name
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const updateFile = async (service, fileId, body) => {
  let result = {
    id: fileId,
    error: null,
  }
  try {
    let response = await service.files.update({
      fileId: fileId,
      resource: body,
    })
    if (response.status !== 200)
      throw 'error updating file'
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const GENERATE_FOLDERS = async () => {
  let service = await getService()
  let parentFolderId  = ''
  let nombres = [] // NOTE: ITEMS
  for (let name of nombres) {
    let resultCreate = await createFolder(service, parentFolderId, name)
    console.log(name, '    ', resultCreate.id)
  }
  console.log('== OK ==')
}

// GENERATE_FOLDERS()

export default {
  getService: getService,
  getListFolder: getListFolder,
  createFolder: createFolder,
  getDirectory: getDirectory,
  uploadFile: uploadFile,
  deleteFile: deleteFile,
  getFile: getFile,
  updateFile: updateFile,
}
