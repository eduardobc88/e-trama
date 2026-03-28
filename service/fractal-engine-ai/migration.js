import MYSQL2 from 'mysql2'
import MYSQL_MIGRATIONS from 'mysql-migrations'
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


try {
  const CONN = MYSQL2.createPool({
    connectionLimit : 1,
    host: process.env.FRACTAL_ENGINE_AI_MYSQL_SERVICE_IP,
    user: process.env.FRACTAL_ENGINE_AI_MYSQL_USER,
    password: process.env.FRACTAL_ENGINE_AI_MYSQL_PASSWORD,
    database: process.env.FRACTAL_ENGINE_AI_MYSQL_DB_NAME,
    debug: false,
  })
  MYSQL_MIGRATIONS.init(CONN, __dirname + '/migrations')
} catch (err) {
  console.log('== MIGRATIONS ERROR ==', err)
} finally {

}

export default {}
