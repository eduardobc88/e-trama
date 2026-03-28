import REPOSITORY from './repository.js'


const search = async (req, res) => {
  let response = {
    items: [],
    status_code: 0,
    status_msg: '',
  }
  try {
    let sessionUserId = req.session.user.id
    let sessionCustomerUserId = req.session.user.user_id
    let sessionUserRoleId = req.session.user.role_id
    let result = await REPOSITORY.fetchRoleResourceDataById(sessionUserRoleId)
    if (result.error)
      throw result.error
    result = await REPOSITORY.filter(sessionUserId, sessionCustomerUserId, result.records, req.query.search, req.session.user.area_id, req.session.user.area_name)
    if (result.error)
      throw result.error
    response.items = result.records
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    await res.send(response)
    return res
  }
}


export default {
  search: search,
}
