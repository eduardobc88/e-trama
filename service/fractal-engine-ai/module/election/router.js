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
    url: '/result/:scope/:type/:election/items/',
    handler: CONTROLLER.getElectionResultItems,
  },
  {
    method: 'GET',
    url: '/result/federal-district/items/',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          scope: { type: 'string' },
          election: { type: 'string' },
          type: { type: 'string' },
        },
        required: ['scope', 'election', 'type'],
      },
    },
    handler: CONTROLLER.getElectionResultByFederalDistrictItems,
  },
  {
    method: 'GET',
    url: '/result/local-district/items/',
    handler: CONTROLLER.getElectionResultByLocalDistrictItems,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          scope: { type: 'string' },
          election: { type: 'string' },
          type: { type: 'string' },
        },
        required: ['scope', 'election', 'type'],
      },
    },
  },
  {
    method: 'GET',
    url: '/result/town/items/',
    handler: CONTROLLER.getElectionResultByTownItems,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          scope: { type: 'string' },
          election: { type: 'string' },
          type: { type: 'string' },
        },
        required: ['scope', 'election', 'type'],
      },
    },
  },
  {
    method: 'GET',
    url: '/result/section/items/',
    handler: CONTROLLER.getElectionResultBySectionItems,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          scope: { type: 'string' },
          election: { type: 'string' },
          type: { type: 'string' },
        },
        required: ['scope', 'election', 'type'],
      },
    },
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
