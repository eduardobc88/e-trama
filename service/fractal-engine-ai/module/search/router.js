
import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '*',
    handler: CONTROLLER.search,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
        },
        required: [
          'search',
        ],
      },
    },
    config: { resource_name: 'search', },
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      resource_name: opts.resource_name,
      preHandler: SESSION.isAuthenticated,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
