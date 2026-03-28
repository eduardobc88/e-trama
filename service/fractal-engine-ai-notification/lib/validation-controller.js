exports.validateSchema = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return res
  }
}
