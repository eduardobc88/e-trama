import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/all/',
    handler: CONTROLLER.getAll,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'resource', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'resource', },
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          path: { type: 'string' },
          menu: { type: 'boolean' },
          records: { type: 'boolean' },
          icon: { type: 'string' },
        },
        required: [
          'name',
          'description',
          'path',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'resource', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          path: { type: 'string' },
          menu: { type: 'boolean' },
          records: { type: 'boolean' },
          icon: { type: 'string' },
        },
        required: [
          'id',
          'name',
          'description',
          'path',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'resource', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: [
          'id',
        ],
      },
    },
    attachValidation: true,
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
