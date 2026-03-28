import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/all/',
    handler: CONTROLLER.getAll,
    config: { resource_name: 'language', },
  },
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'language', },
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'language', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'language', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
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
