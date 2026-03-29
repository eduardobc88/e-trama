import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/:candidate_type/items/',
    schema: {
      params: {
        type: 'object',
        properties: {
          candidate_type: { type: 'string' },
        },
        required: [
          'candidate_type',
        ],
      },
    },
    handler: CONTROLLER.getAll,
    config: { resource_name: 'candidate', },
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
