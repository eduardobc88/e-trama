import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'card', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'card', },
  },
  {
    method: 'GET',
    url: '/town/:id/',
    handler: CONTROLLER.getByTown,
    config: { resource_name: 'card', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'card', },
    schema: {
      body: {
        type: 'object',
        properties: {
          town_id: { type: 'number' },
          link_name: { type: 'string' },
          local_district: { type: 'number' },
          federal_district: { type: 'number' },
          phone: { type: 'number' },
          town_authority_list_json: { type: 'array' },
          possible_candidate_list_json: { type: 'array', },
          town_actor_list_json: {type: 'array' },
          group_list_json: { type: 'array', },
          group_description: { type: 'string', },
          advice_list_json: { type: 'array', },
          numerals_list_json: { type: 'array', },
        },
        required: [
          'town_id',
          'link_name',
          'local_district',
          'federal_district',
          ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.update,
    config: { resource_name: 'card', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          town_id: { type: 'number' },
          link_name: { type: 'string' },
          local_district: { type: 'number' },
          federal_district: { type: 'number' },
          phone: { type: 'number' },
          town_authority_list_json: { type: 'array' },
          possible_candidate_list_json: { type: 'array', },
          town_actor_list_json: {type: 'array' },
          group_list_json: { type: 'array', },
          group_description: { type: 'string', },
          advice_list_json: { type: 'array', },
          numerals_list_json: { type: 'array', },
        },
        required: [
          'id',
          'town_id',
          'link_name',
          'local_district',
          'federal_district',
          ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'card', },
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
      preHandler: SESSION.isAuthenticated,
    }
    route.config = { ...route.config, ...defaultOptions }
    instance.route(route)
  })
}
