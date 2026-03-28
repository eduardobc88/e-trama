const controller = require('./controller')


const ROUTES = [
  {
    method: 'POST',
    url: '/notification-service/',
    handler: controller.pushNotification,
  },
]

exports.default = async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}

