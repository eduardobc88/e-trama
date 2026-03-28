const getTransportMethod = () => {
  let transportMethod = ['polling']
  if ('WebSocket' in window)
    transportMethod[0] = 'websocket'
  return transportMethod
}

class IO {
  IO_INSTANCE = null

  constructor () {
    this.IO_INSTANCE = io('/', {
      path: '/notification-service/socket-io/',
      reconnection: false,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 6000,
      reconnectionAttempts: Infinity,
      transports: getTransportMethod(),
    })
  }

  async socketIOConnect () {
    this.IO_INSTANCE.io.opts.reconnection = true
    this.IO_INSTANCE.io._reconnection = true
    await this.IO_INSTANCE.connect()
    this.socketIOEventManager()
  }

  socketIOEventManager () {
    this.IO_INSTANCE.on('connect', () => {
      console.log('== socketIO - connect ==')
    })
    this.IO_INSTANCE.on('disconnect', reason => {
      console.log('== socketIO - disconnect ==', reason)
    })
    this.IO_INSTANCE.on('reconnecting', (attemptNumber) => {
      console.log('== socketIO - reconnecting ==', attemptNumber)
    })
    this.IO_INSTANCE.on('reconnect_error', error => {
      console.log('== socketIO - reconnect_error ==', error)
    })
    this.IO_INSTANCE.on('reconnect_failed', () => {
      console.log('== socketIO - reconnect_failed ==')
    })
    this.IO_INSTANCE.on('error', error => {
      console.log('== socketIO - error ==', error)
    })
    this.IO_INSTANCE.on('connect_timeout', timeout => {
      console.log('== socketIO - connect_timeout ==', timeout)
    })
  }

  registerEvent (eventName, callback) {
    this.IO_INSTANCE.on(eventName, callback)
  }

  unregisterEvent (eventName) {
    this.IO_INSTANCE.off(event)
  }
}

export default {
  IO: IO,
}
