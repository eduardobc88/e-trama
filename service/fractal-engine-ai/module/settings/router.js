import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/',
    handler: CONTROLLER.get,
    config: { resource_name: 'settings', },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'settings', },
    schema: {
      body: {
        type: 'object',
        properties: {
          use_google_drive: { type: 'boolean' },
          gd_folder_id: { type: 'string' },
          gd_auth_client_email: { type: 'string' },
          gd_auth_private_key: { type: 'string' },
          items_by_page: { type: 'number' },
        },
        required: [
          'use_google_drive',
          'items_by_page',
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
