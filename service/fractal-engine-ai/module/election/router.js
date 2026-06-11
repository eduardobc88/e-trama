import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/type/items/',
    handler: CONTROLLER.getElectionItems,
  },
  {
    method: 'GET',
    url: '/result/:scope/:type/:year/items/',
    handler: CONTROLLER.getElectionResultItems,
  },
  {
    method: 'GET',
    url: '/result/federal-district/:scope/:type/:year/items/',
    handler: CONTROLLER.getElectionResultByFederalDistrictItems,
  },
  {
    method: 'GET',
    url: '/result/local-district/:scope/:type/:year/items/',
    handler: CONTROLLER.getElectionResultByLocalDistrictItems,
  },
  {
    method: 'GET',
    url: '/result/town/:scope/:type/:year/items/',
    handler: CONTROLLER.getElectionResultByTownItems,
  },
  {
    method: 'GET',
    url: '/result/section/:scope/:type/:year/items/',
    handler: CONTROLLER.getElectionResultBySectionItems,
  },
  {
    method: 'GET',
    url: '/items/:state/',
    handler: CONTROLLER.getAll,
  },
]

export default async (instance, opts) => {
  ROUTES.forEach(route => {
    const defaultOptions = {
      name: opts.name,
      resource_name: opts.resource_name,
      config: { resource_name: opts.resource_name, },
    }
    route.config = { ...route.config, ...defaultOptions }
    route.preHandler = SESSION.isAuthenticated
    instance.route(route)
  })
}
