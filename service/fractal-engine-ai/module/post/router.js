import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'post', },
  },
  {
    method: 'GET',
    url: '/search/items/:page/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'post', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'post', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'post', },
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          excerpt: { type: 'string' },
          category_id: { type: 'number' },
          content: { type: 'string' },
          status: { type: 'string' },
          file_id: { type: 'number' },
          file_ids: { type: 'array' },
        },
        required: [
          'title',
          'category_id',
          'content',
          'status',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'post', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          excerpt: { type: 'string' },
          category_id: { type: 'number' },
          content: { type: 'string' },
          status: { type: 'string' },
          file_id: { type: 'number' },
          file_ids: { type: 'array' },
        },
        required: [
          'id',
          'title',
          'category_id',
          'content',
          'status',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'post', },
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

