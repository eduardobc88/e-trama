import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'user', },
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'user', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'user', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'user', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
          role_id: { type: 'integer' },
          user_pass: { type: 'string' },
          area_id: { type: 'integer' },
          theme: { type: 'boolean' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
          'role_id',
          'user_pass',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'user', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
          role_id: { type: 'integer' },
          area_id: { type: 'integer' },
          theme: { type: 'boolean' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
          'role_id',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'user', },
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
  {
    method: 'PUT',
    url: '/update-password/',
    handler: CONTROLLER.putPassword,
    schema: {
      body: {
        type: 'object',
        properties: {
          users: { type: 'array' },
        },
        required: [
          'users',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'user', },
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
