import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/',
    handler: CONTROLLER.get,
    config: { resource_name: 'profile', },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'profile', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
          theme: { type: 'boolean' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
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
