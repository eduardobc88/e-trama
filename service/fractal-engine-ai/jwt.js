import fastifyJWT from '@fastify/jwt'

import SERVICE_CONFIG from './config.js'


export default instance => {
  instance.register(fastifyJWT, {
    secret: SERVICE_CONFIG.appSecret,
    verify: {
      extractToken: (req, reply) => {
        let token = ''
        try {
          token = req.headers['fractal-api-key']
          if (token === undefined)
            throw new Error('no authorization headers token')
        } catch (err) {
          console.error('== extract token ==', err.toString())
        }
        return token
      },
    },
  })

  instance.post('/jwt/generate-token/', async (req, reply) => {
    let response = {
      status_code: 0,
      status_msg: 'use token in headers',
      data: {},
    }
    try {
      const token = await instance.jwt.sign({ token: req.body.id })
      response.data['fractal-api-key'] = token
    } catch (err) {
      response.status_code = 1
      response.status_msg = err.toString()
    }
    await reply.send(response)
    return reply
  })

  instance.get('/jwt/verify-token/', async (req, reply) => {
    let response = {
      status_code: 0,
      status_msg: 'it works!',
      data: {},
    }
    reply.send(response)
  })

  // instance.addHook('onRequest', async (req, reply) => {
  //   try {
  //     let verify = await req.jwtVerify()
  //     await reply.send(verify)
  //   } catch (err) {
  //     reply.send(err)
  //   }
  //   return reply
  // })

  instance.decorateReply('jwtSing', async id => {
    let token = ''
    try {
      token = await instance.jwt.sign({ token: id })
    } catch (err) {

    }
    return token
  })
}

// TODO: IMPROVE AND TEST
