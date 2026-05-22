import controller from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/federal-district/',
    handler: controller.getFederalDistrictItems,
  },
  {
    method: 'GET',
    url: '/items/local-district/',
    handler: controller.getLocalDistrictItems,
  },
  {
    method: 'GET',
    url: '/items/town/',
    handler: controller.getTownItems,
  },
  {
    method: 'GET',
    url: '/items/section/',
    handler: controller.getSectionItems,
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      resource_name: opts.resource_name,
      config: { free: true, },
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
