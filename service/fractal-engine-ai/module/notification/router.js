import session from '../../lib/session.js'
import controller from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: controller.getPage,
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: controller.get,
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      preHandler: session.isAuthenticated,
      resource_name: opts.resource_name,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
