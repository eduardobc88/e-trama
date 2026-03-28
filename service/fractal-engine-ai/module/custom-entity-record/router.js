import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/:custom_entity_name/items/:page/',
    handler: CONTROLLER.getPage,
  },
  {
    method: 'GET',
    url: '/:custom_entity_name/search/items/',
    // TODO: FIX THIS PERMISSION
/*     preHandler: SESSION.isAuthenticated, */
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
  },
  {
    method: 'GET',
    url: '/:custom_entity_name/:id/',
    handler: CONTROLLER.get,
  },
  {
    method: 'POST',
    url: '/:custom_entity_name/',
    handler: CONTROLLER.post,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          attachment_files: { type: 'array' },
        },
        required: [
          'id',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/:custom_entity_name/',
    handler: CONTROLLER.put,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          attachment_files: { type: 'array' },
        },
        required: [
          'id',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/:custom_entity_name/',
    handler: CONTROLLER.remove,
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
  {
    method: 'GET',
    url: '/related-record/search/items/',
    handler: CONTROLLER.searchRelatedRecord,
    querystring: {
      s: { type: 'string' }
    },
  },
  {
    method: 'GET',
    url: '/:custom_entity_name/:id/related-record/:related_record_id/:origin_area_id/:destination_area_id/',
    handler: CONTROLLER.getRelatedRecord,
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
