
exports.pushNotification = async (req, res) => {
  res.pushBroadcastMessage(req.body)
  await res.send({
    status: 'ok',
  })
  return res
}
