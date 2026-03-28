import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'POST',
    url: '/login/',
    handler: CONTROLLER.login,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_name: { type: 'string' },
          user_pass: { type: 'string' },
        },
        required: [
          'user_name',
          'user_pass',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/logout/',
    handler: CONTROLLER.logout,
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/logout/all/',
    handler: CONTROLLER.logoutAll,
    attachValidation: true,
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      resource_name: opts.resource_name,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
