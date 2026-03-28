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
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: controller.get,
  },
  {
    method: 'POST',
    url: '/',
    handler: controller.post,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: [
          'name',
          'description',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: controller.put,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: [
          'name',
          'description',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: controller.remove,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: [
          'id',
        ],
      },
    },
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      resource_name: opts.resource_name,
      preHandler: session.isAuthenticated,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
