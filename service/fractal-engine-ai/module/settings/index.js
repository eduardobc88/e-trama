import ROUTER from './router.js'
import { setSettings } from './controller.js'
import path from 'node:path';
import { fileURLToPath } from 'node:url'

const filePath = fileURLToPath(import.meta.url)
const moduleName = path.basename(path.dirname(filePath))


export default async (instance, opts) => {
  let status = 'OK'
  const config = {
    name: moduleName.replaceAll('-', ' '),
    resource_name: moduleName,
    prefix: `/fractal-engine-ai-service/api/v1/${ moduleName }`,
  }
  try {
    if (opts.setSettings) {
      let res = await setSettings()
      if (res.error !== null)
        throw res.error
    }
    instance.register(ROUTER, {
      prefix: config.prefix,
      name: config.name,
      resource_name: config.resource_name,
    })
  } catch (err) {
    console.error(err)
    status = 'ERROR'
  } finally {
    console.log(`== MODULE : ${ config.name } : ${ status } ==`)
  }
}
