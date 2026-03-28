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
          description: { type: 'string' },
          'type': { type: 'string' },
          custom_list_id: { type: 'number' },
          custom_entity_id: { type: 'number' },
          custom_entity_field_id: { type: 'number' },
        },
        required: [
          'name',
          'description',
          'type',
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
          description: { type: 'string' },
          'type': { type: 'string' },
          custom_list_id: { type: 'number' },
          custom_entity_id: { type: 'number' },
          custom_entity_field_id: { type: 'number' },
        },
        required: [
          'name',
          'description',
          'type',
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
