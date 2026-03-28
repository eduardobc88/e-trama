import CONFIG_MANIFEST from './config-manifest.js'
import TEMPLATE_MANIFEST from './template-manifest.js'


let ROUTES = []
for (let tName of Object.keys(TEMPLATE_MANIFEST)) {
  if (tName === 'CustomRecord' || tName === 'CustomRecords')
    continue

  let tNameArr = tName.split(/(?=[A-Z])/)
  let templateComponent = TEMPLATE_MANIFEST[tName]
  let templateName = tNameArr.join().toLowerCase()
  let title = templateName.replaceAll(',', ' ')
  let name = ''
  if (tNameArr.includes('Index')) {
    name = templateName.replaceAll(',index', '').replaceAll(',', '-')
    let path = `/${ name }/`
    if (name === 'wellcome')
      path = '/'
    ROUTES.push({
      name: name,
      path: path,
      component: templateComponent,
      meta: {
        title: title,
        icon: '',
        description: '',
      },
    })
  } else if (tNameArr.includes('Records')) {
    name = templateName.replaceAll(',records', '').replaceAll(',', '-')
    ROUTES.push({
      name: `${ name }-records`,
      path: `/${ name }/records/:page/`,
      component: TEMPLATE_MANIFEST['Records'],
      meta: {
        title: title,
        icon: '',
        description: '',
      },
    })
  } else if (tNameArr.includes('Record')) {
    name = templateName.replaceAll(',record', '').replaceAll(',', '-')
    ROUTES.push({
      name: `${ name }-record`,
      path: `/${ name }/record/:id?/`,
      component: templateComponent,
      meta: {
        title: title,
        icon: '',
        description: '',
      },
    })
    ROUTES.push({
      name: `${ name }-records`,
      path: `/${ name }/records/:page/`,
      component: TEMPLATE_MANIFEST['Records'],
      meta: {
        title: title,
        icon: '',
        description: '',
      },
    })
  }
}


const REBUILD_ROUTES = routerInstance => {
  // NOTE: SET ICONS
  for (let index in ROUTES) {
    let r = ROUTES[index]
    for (let i of CONFIG_MANIFEST.user_data.get('role_resources'))
      if (r.name.includes(i.name)) {
        ROUTES[index].meta.icon = i.icon
        ROUTES[index].meta.title = i.name.replaceAll('-', ' ')
        ROUTES[index].meta.description = i.description
        break
      }
  }
  // NOTE: SET CUSTOM ENTITIES
  let exist = false
  let title = ''
  let description = ''
  for (let i of CONFIG_MANIFEST.user_data.get('role_resources')) {
    exist = false
    title = i.name.replaceAll('-', ' ')
    description = i.description
    for (let r of ROUTES)
      if (r.name === i.name || r.name === `${ i.name }-record` || r.name === `${ i.name }-records`) {
        exist = true
        break
      }
    // NOTE: ADD CUSTOM ENTITY ROUTES FROM ROLE RESOURCE
    // TODO: ADD SOME PREFIX TO KNOW ID CUSTOM ENTITY AND DON'T SHOW IN THE MENU IF NOT EXISTS
    if (!exist && i.menu) {
      if (i.records) {
        // NOTE: RECORD
        routerInstance.addRoute({
          meta: {
            title: title,
            description: description,
            icon: i.icon,
          },
          name: `${ i.name }-record`,
          path: `/${ i.name }/record/:id?/`,
          component: TEMPLATE_MANIFEST.CustomRecord,
        })
        // NOTE: RECORDS
        routerInstance.addRoute({
          meta: {
            title: title,
            description: description,
            icon: i.icon,
          },
          name: `${ i.name }-records`,
          path: `/${ i.name }/records/:page/`,
          component: TEMPLATE_MANIFEST.CustomRecords,
        })
      } else
        routerInstance.addRoute({
          meta: {
            title: title,
            description: description,
            icon: i.icon,
          },
          name: i.name,
          path: `/${ i.name }/`,
          component: ((i.records)?TEMPLATE_MANIFEST.CustomRecords:TEMPLATE_MANIFEST.CustomRecord),
        })
    }
  }
}

export default {
  routes: ROUTES,
  rebuildRouter: REBUILD_ROUTES,
}
