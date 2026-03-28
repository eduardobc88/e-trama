import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/all/',
    handler: CONTROLLER.getAll,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'role', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'role_name',
          'role_resources',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'id',
          'role_name',
          'role_resources',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'id',
          'role_name',
          'role_resources',
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

