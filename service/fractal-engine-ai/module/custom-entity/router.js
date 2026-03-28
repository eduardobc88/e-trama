import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
  },
  {
    method: 'GET',
    url: '/name/:custom_entity_name/',
    handler: CONTROLLER.getByName,
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          resource_name: { type: 'string' },
          description: { type: 'string' },
        },
        required: [
          'name',
          'resource_name',
          'description',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          resource_name: { type: 'string' },
          description: { type: 'string' },
        },
        required: [
          'name',
          'description',
          'resource_name',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
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
  {
    method: 'GET',
    url: '/search/:custom_entity_id/field/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.searchEntityFields,
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
