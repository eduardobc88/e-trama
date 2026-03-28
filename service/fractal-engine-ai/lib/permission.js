import roleResourceRepository from '../module/role-resource/repository.js'


const API_PERMISSION = {
  GET: 'r',
  POST: 'c',
  PUT: 'u',
  DELETE: 'd',
}

const canUser = async objectData => {
  let permission = API_PERMISSION[objectData.req.routeOptions.config.method]
  let resourceName = objectData.req.routeOptions.config.resource_name
  let customEntityName = ''
  if (resourceName === 'custom-entity-record')
    customEntityName = objectData.req.params.custom_entity_name
  let hasPermission = await roleResourceRepository.hasPermission(objectData.req.session.user.role_id, resourceName, permission, customEntityName)
  // console.log('== PERMISSION - url | method | permission | res ==', objectData.req.routeOptions.config.url, objectData.req.routeOptions.config.method, permission, hasPermission)
  return hasPermission.total > 0
}


export default {
  canUser: canUser,
}
