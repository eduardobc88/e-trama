import {
  utils,
  writeFile,
} from 'xlsx'

import CONFIG_MANIFEST from '../../config-manifest.js'


const getHexColor = (str, plain = false, s = 40, l = 80, opacity = 100) => {
  if (!str)
    return ''

  var hash = 0;
  // var s = 65; // saturation: 0 - 100
  // var l = 65; // lightness: 0 - 100
  for (var i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 2) - hash);
  var h = hash % 360;
  if (plain)
    return `hsl(${ h }deg ${ s }% ${ l }% / ${ opacity }%)`;
  return `background-color: hsl(${ h }deg ${ s }% ${ l }% / ${ opacity }%);`
}

const getAvatarURL = (fileURL, roleName = '') => {
  if (!fileURL)
    return ''

  let style = ''
  style += `background-image: url(/static/storage/upload/${ fileURL });`
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const getFileURL = fileURL => {
  if (!fileURL)
    return ''

  return `/static/storage/upload/${ fileURL }`
}

const getThumbnailURL = fileURL => {
  if (!fileURL)
    return ''

  let style = ''
  style += `background-image: url('/static/storage/upload/${ fileURL }');`
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const aclReplaceVNode = (el, binding, vNode) => {
  if (!binding.value)
    return

  let permissionResult = aclUserCan(binding.value)
  if (permissionResult)
    return

  const comment = document.createComment('')
  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined,
  })
  vNode.elm = comment
  vNode.text = ''
  vNode.isComment = true
  vNode.context = undefined
  vNode.tag = undefined
  // vNode.data.directives = undefined
  vNode.ctx.data.directives = undefined
  vNode.ctx.directives = undefined
  // console.log('== ok ==', binding.value, vNode.ctx)
  if (vNode.componentInstance)
    vNode.componentInstance.$el = comment
  if (el.parentNode)
    el.parentNode.replaceChild(comment, el)
}

const aclUserCan = (resource, isRoute = false) => {
  // NOTE: in role_resources: ['v',] is 'view'
  let can = false
  if (CONFIG_MANIFEST.user_data === undefined)
    return can

  let permission = 'v'
  let roleResources = CONFIG_MANIFEST.user_data.get ? CONFIG_MANIFEST.user_data.get('role_resources') : CONFIG_MANIFEST.user_data.role_resources
  for (let rr of roleResources) {
    if (isRoute && rr.permission.includes(permission) && (`${ rr.name }-record` === resource || `${ rr.name }-records` === resource)) {
      can = true
      break
    } else if (rr.permission.includes(permission) && rr.permission.includes(permission) && rr.name === resource) {
      can = true
      break
    }
  }
  return can
}

const getCookie = name => {
  for (let i of document.cookie.split(';')) {
    let cookie = i.split('=')
    if (cookie[0].indexOf(name) >= 0)
      return cookie[1].split('.')[0]
  }
}

const isMobile = () => {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    return true
  return false
}

const isImage = (fileName = '') => {
  if (fileName === null)
    return false

  let extension = fileName.split('.').pop().toLowerCase()
  if (extension === 'jpg' || extension === 'png' || extension === 'jpeg')
    return true

  return false
}

const getModelColumns = (model, prefix, defaultProps) => {
  let propsNames = []
  let attributes = Object.keys(model.attributes)
  for (let attr of attributes) {
    let propName = attr.replace(`${ prefix }_`, '')
    propName = propName.replace(/\_/g, ' ')
    let value = false
    if (defaultProps.includes(attr))
      value = true
    if (attr === 'id')
      value = true
    propsNames.push({
      item_name: propName,
      item_prop: attr,
      item_value: value,
    })
  }
  return propsNames
}

const getImageURL = (fileURL, roleName = '', size = '150x150', json = false) => {
  if (!fileURL)
    return ''

  let clientId = window.user_client_id
  if (roleName === 'administrator')
    clientId = '000000000000000000000000'
  let fileNameArray = fileURL.split('.')
  if (json)
    return {
      'background-image': `url(/static/storage/upload/sizes/${ fileNameArray[0] }-${ size }.${ fileNameArray[1] }`,
      'background-size': 'cover',
      'background-position': 'center',
    }
  let style = ''
  style += `background-image: url(/static/storage/upload/sizes/${ fileNameArray[0] }-${ size }.${ fileNameArray[1] });`
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const getGDFileURL = (baseURL, id, redirect = false) => {
  return `${ baseURL }/file/google-drive/${ id }/?redirect=${ redirect }`
}

const getOptionsFromCollection = (collection, propNameToShow, propName, matchId, onFinish, functionName = 'fetchAll', matchProp = 'id') => {
  return new Promise((resolve, reject) => {
    let options = []
    let indexMatch = -1
    return collection[functionName]()
      .then(data => {
        for (let index in collection.getModels()) {
          let option = collection.models[index]
          let id = option.get(matchProp)
          options.push({
            name: option.get(`${ propNameToShow }`),
            value: option,
            prop_name: propName,
            selected: false,
          })
          if (parseInt(matchId) === parseInt(id))
            indexMatch = index
        }
        if (onFinish !== null)
          onFinish({
            options: options,
            index: indexMatch,
          })
        resolve({
          status: true,
          options: options,
          index: indexMatch,
        })
      })
      .catch(err => {
        if (onFinish !== null)
          onFinish({
            options: options,
            index: indexMatch,
          })
        reject({
          status: false,
          options: options,
          index: indexMatch,
        })
      })
  })
}

const getGeneratedOptionsFromCollection = (collection, propNameToShow, propName, matchId, onFinish) => {
  return new Promise((resolve, reject) => {
    let options = []
    let indexMatch = -1
    for (let index in collection.models) {
      let option = collection.models[index]
      let id = option.get('id')
      options.push({
        name: option.get(`${ propNameToShow }`),
        value: option,
        prop_name: propName,
        selected: false,
      })
      if (matchId === parseInt(id))
        indexMatch = index
    }
    onFinish({
      options: options,
      index: indexMatch,
    })
    resolve({status: true})
  })
}

const exportToXLSX = (fileName, workbookData) => {
  // NOTE: exportToXLSX example
  // workbookData = [{
  //     wb_name: 'animals',
  //     wb_data: [
  //       {"name": "cat", "category": "animal"},
  //       {"name": "dog", "category": "animal"},
  //       {"name": "pig", "category": "animal"}
  //     ]
  //   },
  //   {
  //     wb_name: 'pokemons',
  //     wb_data: [
  //       {"name": "pikachu", "category": "pokemon"},
  //       {"name": "Arbok", "category": "pokemon"},
  //       {"name": "Eevee", "category": "pokemon"}
  //     ]
  //   }]

  if (workbookData.length === 0 || fileName === '')
    return

  var wb = utils.book_new()
  for (let workbook of workbookData) {
    let wbName = workbook.wb_name
    let wbData = workbook.wb_data
    var wbSheet = utils.json_to_sheet(wbData)
    utils.book_append_sheet(wb, wbSheet, wbName)
  }
  writeFile(wb, `${ fileName }.xlsx`)
}

const getFormatDate = (date, format) => {
  let formated = ''
  let dateISOStr = date.toISOString()
  if (format === 'YYYY-MM-DD')
    formated = dateISOStr.split('T')[0]
  else if (format === 'YYYY-MM-DD HH:mm:ss')
    formated = `${ dateISOStr.split('T')[0] } ${ dateISOStr.split('T')[1].split('.')[0] }`
  else if (format === 'YYYY')
    formated = dateISOStr.split('T')[0].split('-')[0]
  else if (format === 'MM')
    formated = dateISOStr.split('T')[0].split('-')[1]
  else if (format === 'DD')
    formated = dateISOStr.split('T')[0].split('-')[2]
  return formated
}

export default {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
  getCookie,
  isMobile,
  isImage,
  getModelColumns,
  getImageURL,
  getFileURL,
  getGDFileURL,
  getOptionsFromCollection: getOptionsFromCollection,
  getGeneratedOptionsFromCollection: getGeneratedOptionsFromCollection,
  getFormatDate: getFormatDate,
  exportTo: {
    xlsx: exportToXLSX,
  },
}
