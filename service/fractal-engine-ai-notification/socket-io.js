const sessionRepository = require('./module/session/repository')
const notificationRepository = require('./module/notification/repository')


class SocketIO {
  constructor () {
  }
  init (showLogs, ioServerInstance, context) {
    this.io = ioServerInstance
    this.context = context
    if (showLogs)
      this.socketIOEventManager()
  }
  socketIOEventManager () {
    this.io.on('connect', () => {
      console.log('== SocketIO - connect ==')
    })
    this.io.on('connection', async socket => {
      let sessionId = this.getSessionId(socket)
      let userSessionData = await sessionRepository.updateUserStatus(sessionId, 'online')
      this.pushBroadcastMessage({
        channel: 'user-status',
        data: userSessionData,
      })
      socket.on('disconnect', async reason => {
        let sessionId = this.getSessionId(socket)
        let userSessionData = await sessionRepository.updateUserStatus(sessionId, 'offline')
        this.pushBroadcastMessage({
          channel: 'user-status',
          data: userSessionData,
        })
      })
    })
  }
  async pushBroadcastMessage (data) {
    let notificationModelResponse = {
      data: {},
    }
    if (data.ids !== undefined)
      for (let id of data.ids.split('-')) {
        notificationModelResponse.data = data.data
        this.io.sockets.emit(`${id}-${data.channel}`, notificationModelResponse)
      }
    else {
      notificationModelResponse.data = data.data
      console.log(data.channel, notificationModelResponse)
      this.io.sockets.emit(data.channel, notificationModelResponse)
    }
    if (data.notification === undefined)
      return

    let rec = await notificationRepository.create(data.notification)
    let notificationData = {
      channel: `${ data.notification.area_id }-notification-post`,
      data: rec,
    }
    this.io.sockets.emit(notificationData.channel, notificationData.data)
  }
  async pushMessageToSessionIds (data) {
    const sockets = await this.io.of('/').fetchSockets()
    let socketIds = []
    for (let si of data.session_ids)
      for (let s of sockets) {
        let { sessionId } = this.context.parseCookie(s.handshake.headers.cookie)
        if (sessionId.includes(si))
          socketIds.push(s.id)
      }
    for (let id of socketIds)
      this.io.to(id).emit(data.channel, data.data)
  }
  getSessionId (socket) {
    let { sessionId } = this.context.parseCookie(socket.handshake.headers.cookie)
    sessionId = sessionId.split('.')[0]
    return sessionId
  }
}

module.exports = SocketIO
