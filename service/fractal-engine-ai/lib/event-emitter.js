let EVENTS = []

// NOTE: EVENTS HAS ITEMS LIKE: { module_name: '', event_name: '', action: function}

const on = (moduleName = '', eventName = '', action = null) => {
  EVENTS.push({
    module_name: moduleName,
    event_name: eventName,
    action: action,
  })
}

const emit = (moduleName = '', eventName = '', params = null) => {
  // NOTE: GET FUNCTIONS WITH MODULE AND EVENT NAME AND EXECT ALL FUNCTIONS
  try {
    for (let f of EVENTS)
      if (f.module_name === moduleName && f.event_name === eventName)
        f.action(params)
  } catch (err) {
    console.error('== emit ==', err)
  } finally {
    
  }
}


export default {
  on: on,
  emit: emit,
}
