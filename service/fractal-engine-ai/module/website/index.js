import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ROUTER from './router.js'

const filePath = fileURLToPath(import.meta.url)
const moduleName = path.basename(path.dirname(filePath))


export default async (instance, opts) => {
  const config = {
    name: moduleName.replaceAll('-', ' '),
    resource_name: '',
    prefix: '',
  }
  instance.register(ROUTER, {
    prefix: config.prefix,
    name: config.name,
    resource_name: config.resource_name,
  })
  console.log(`== MODULE : ${ config.name } ==`)
}
