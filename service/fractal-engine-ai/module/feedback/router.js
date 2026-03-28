import session from '../../lib/session.js'
import controller from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: controller.getPage,
    config: { resource_name: 'feedback', },
  },
  {
    method: 'GET',
    url: '/search/items/:page/',
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'feedback', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: controller.get,
    config: { resource_name: 'feedback', },
  },
  {
    method: 'POST',
    url: '/',
    handler: controller.post,
    config: { resource_name: 'feedback', },
    schema: {
      body: {
        type: 'object',
        properties: {
          feedback_title: { type: 'string' },
          feedback_description: { type: 'string' },
          category_id: { type: 'number' },
        },
        required: [
          'feedback_title',
          'feedback_description',
          'category_id',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: controller.put,
    config: { resource_name: 'feedback', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          feedback_title: { type: 'string' },
          feedback_description: { type: 'string' },
          category_id: { type: 'number' },
        },
        required: [
          'id',
          'feedback_title',
          'feedback_description',
          'category_id',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: controller.remove,
    config: { resource_name: 'feedback', },
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
