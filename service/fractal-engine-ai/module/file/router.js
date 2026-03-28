import SESSION from '../../lib/session.js'
import CONTROLLER from './controller.js'


const ROUTES = [
  {
    method: 'GET',
    url: '/items/:page/',
    handler: CONTROLLER.getPage,
    config: { resource_name: 'file', },
  },
  {
    method: 'GET',
    url: '/search/items/',
    querystring: {
      s: { type: 'string' }
    },
    handler: CONTROLLER.search,
    config: { resource_name: 'file', },
  },
  {
    method: 'GET',
    url: '/:id/',
    handler: CONTROLLER.get,
    config: { resource_name: 'file', },
  },
  {
    method: 'POST',
    url: '/',
    handler: CONTROLLER.post,
    config: { resource_name: 'file', },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/',
    handler: CONTROLLER.put,
    config: { resource_name: 'file', },
    attachValidation: true,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          file_title: { type: 'string' },
        },
        required: [
          'id',
          'file_title',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/',
    handler: CONTROLLER.remove,
    config: { resource_name: 'file', },
    attachValidation: true,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: [
          'id',
        ],
      },
    },
  },
  {
    method: 'GET',
    url: '/:custom_entity_record_area/:custom_entity_record_id/:id/',
    schema: {
      properties: {
        type: 'object',
        properties: {
          custom_entity_record_area: { type: 'string' },
          custom_entity_record_id: { type: 'number' },
          id: { type: 'integer' },
        },
        required: [
          'custom_entity_record_area',
          'custom_entity_record_id',
          'id',
        ],
      },
    },
    handler: CONTROLLER.getAttachmentFile,
    config: { resource_name: 'file', },
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
