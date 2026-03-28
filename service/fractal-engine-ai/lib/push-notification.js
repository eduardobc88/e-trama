import http from 'http'

import SERVICE_CONFIG from '../config.js'


// NOTE: example
// res.pushNotification({
//   channel_id: '182737949832012',
//   channel_model: 'user',
//   channel_method: 'post',
//   channel_dashboard: 'erp|hospital|...'
//   channel_data: {
//     _id: '1234',
//     id: '1234',
//     user_name: 'test',
//     user_email: 'test@test.com',
//   },
// })

const pushNotification = data => {
  const jsonData = JSON.stringify(data)
  const req = http.request({
    hostname: SERVICE_CONFIG.notificationServiceIP,
    port: 80,
    path: '/notification-service/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': jsonData.length,
      'Host': process.env.FRACTAL_ENGINE_AI_HOST_IP,
    },
  })
  req.on('error', error => {
    console.error('== pushNotification error ==', error)
  })
  req.write(jsonData)
  req.end()
}


export default {
  pushNotification: pushNotification,
}
