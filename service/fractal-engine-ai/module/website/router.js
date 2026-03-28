import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/*',
    handler: CONTROLLER.getDashboard,
    config: { free: true, },
  },
  {
    method: 'GET',
    url: '/recover-account/',
    handler: CONTROLLER.getRecoverAccount,
    config: { free: true, },
  },
  {
    method: 'POST',
    url: '/recover-account/',
    preHandler: SESSION.validateSchema,
    handler: CONTROLLER.postRecoverAccount,
    config: { free: true, },
    schema: {
      body: {
        type: 'object',
        properties: {
          email_address: { type: 'string' },
        },
        required: [
          'email_address',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/reset-password/:token/',
    handler: CONTROLLER.getResetPassword,
    config: { free: true, },
  },
  {
    method: 'POST',
    url: '/reset-password/',
    preHandler: SESSION.validateSchema,
    handler: CONTROLLER.postResetPassword,
    schema: {
      body: {
        type: 'object',
        properties: {
          new_password: { type: 'string' },
        },
        required: [
          'new_password',
        ],
      },
    },
    config: { free: true, },
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
