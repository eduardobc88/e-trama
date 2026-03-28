let registryFormEl = null

let cardEl = null
let cardFileName = null
let nameEl = null
let paternalSurnameEl = null
let maternalSurnameEl = null
let phoneEl = null
let stateEl = null
let townEl = null
let sectionEl = null
let addressEl = null

let cardHintEl = null
let nameHintEl = null
let paternalSurnameHintEl = null
let maternalSurnameHintEl = null
let phoneHintEl = null
let stateHintEl = null
let townHintEl = null
let sectionHintEl = null
let addressHintEl = null

let cardErrorEl = null
let nameErrorEl = null
let paternalSurnameErrorEl = null
let maternalSurnameErrorEl = null
let phoneErrorEl = null
let stateErrorEl = null
let townErrorEl = null
let sectionErrorEl = null
let addressErrorEl = null


const onInputFocus = el => {
  if (el.value)
    el.classList.add('no-empty')
  el.classList.toggle('active')
}

const validateEmail = email => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    return true

  return false
}

const reset = () => {
  cardHintEl.style = 'display: block'
  cardErrorEl.innerText = ''
  nameHintEl.style = 'display: block'
  nameErrorEl.innerText = ''
  paternalSurnameHintEl.style = 'display: block'
  paternalSurnameErrorEl.innerText = ''
  maternalSurnameHintEl.style = 'display: block'
  maternalSurnameErrorEl.innerText = ''
  phoneHintEl.style = 'display: block'
  phoneErrorEl.innerText = ''
  stateHintEl.style = 'display: block'
  stateErrorEl.innerText = ''
  townHintEl.style = 'display: block'
  townErrorEl.innerText = ''
  sectionHintEl.style = 'display: block'
  sectionErrorEl.innerText = ''
  addressHintEl.style = 'display: block'
  addressErrorEl.innerText = ''
}

let onSubmit = e => {
  let passed = true
  reset()
  if (cardEl.value === '') {
    passed = false
    cardHintEl.style = 'display: none'
    cardErrorEl.innerText = 'requerido'
  }
  if (nameEl.value === '') {
    passed = false
    nameHintEl.style = 'display: none'
    nameErrorEl.innerText = 'requerido'
  }
  if (paternalSurnameEl.value === '') {
    passed = false
    paternalSurnameHintEl.style = 'display: none'
    paternalSurnameErrorEl.innerText = 'requerido'
  }
  if (maternalSurnameEl.value === '') {
    passed = false
    maternalSurnameHintEl.style = 'display: none'
    maternalSurnameErrorEl.innerText = 'requerido'
  }
  if (phoneEl.value === '') {
    passed = false
    phoneHintEl.style = 'display: none'
    phoneErrorEl.innerText = 'requerido'
  }
  if (stateEl.value == '0') {
    passed = false
    stateHintEl.style = 'display: none'
    stateErrorEl.innerText = 'requerido'
  }
  if (townEl.value == '0') {
    passed = false
    townHintEl.style = 'display: none'
    townErrorEl.innerText = 'requerido'
  }
  if (sectionEl.value === '') {
    passed = false
    sectionHintEl.style = 'display: none'
    sectionErrorEl.innerText = 'requerido'
  }
  if (addressEl.value === '') {
    passed = false
    addressHintEl.style = 'display: none'
    addressErrorEl.innerText = 'requerido'
  }
  if (!passed && e !== undefined)
    e.preventDefault()
}


const onKeyup = el => {
  if (el.target.id === 'card') {
    cardHintEl.style = 'display: block'
    cardErrorEl.innerText = ''
    if (el.target.value === '') {
      cardHintEl.style = 'display: none'
      cardErrorEl.innerText = 'requerido'
    } else
      cardFileName.innerText = el.target.files[0].name
  } else if (el.target.id === 'name') {
    nameHintEl.style = 'display: block'
    nameErrorEl.innerText = ''
    if (el.target.value === '') {
      nameHintEl.style = 'display: none'
      nameErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'paternal_surname') {
    paternalSurnameHintEl.style = 'display: block'
    paternalSurnameErrorEl.innerText = ''
    if (el.target.value === '') {
      paternalSurnameHintEl.style = 'display: none'
      paternalSurnameErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'maternal_surname') {
    maternalSurnameHintEl.style = 'display: block'
    maternalSurnameErrorEl.innerText = ''
    if (el.target.value === '') {
      maternalSurnameHintEl.style = 'display: none'
      maternalSurnameErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'phone') {
    phoneHintEl.style = 'display: block'
    phoneErrorEl.innerText = ''
    if (el.target.value === '') {
      phoneHintEl.style = 'display: none'
      phoneErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'state') {
    stateHintEl.style = 'display: block'
    stateErrorEl.innerText = ''
    if (el.target.value == '0') {
      stateHintEl.style = 'display: none'
      stateErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'town') {
    townHintEl.style = 'display: block'
    townErrorEl.innerText = ''
    if (el.target.value == '0') {
      townHintEl.style = 'display: none'
      townErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'section') {
    sectionHintEl.style = 'display: block'
    sectionErrorEl.innerText = ''
    if (el.target.value === '') {
      sectionHintEl.style = 'display: none'
      sectionErrorEl.innerText = 'requerido'
    }
  } else if (el.target.id === 'address') {
    addressHintEl.style = 'display: block'
    addressErrorEl.innerText = ''
    if (el.target.value === '') {
      addressHintEl.style = 'display: none'
      addressErrorEl.innerText = 'requerido'
    }
  }
}


const onChangeSelect = el => {
  if (el.id === 'state') {
    // NOTE: fetch state towns by id state
    getTowns(el.value)
  }
}

async function getTowns (stateId) {
  const response = await fetch(`/registry/location/state/${ stateId }/town/items/`)
  const jsonData = await response.json()
  let optionsHTML = '<option value="0" default>selecciona un municipio</option>'
  for (let i of jsonData.items)
    optionsHTML = optionsHTML + `<option value="${ i.town_id }">${ i.name }</option>`
  townEl.innerHTML = optionsHTML
}

window.addEventListener('load', e => {
  registryFormEl = document.getElementById('registry-form')

  cardEl = document.getElementById('card')
  cardFileName = document.getElementById('card_file_name')
  nameEl = document.getElementById('name')
  paternalSurnameEl = document.getElementById('paternal_surname')
  maternalSurnameEl = document.getElementById('maternal_surname')
  phoneEl = document.getElementById('phone')
  stateEl = document.getElementById('state')
  townEl = document.getElementById('town')
  sectionEl = document.getElementById('section')
  addressEl = document.getElementById('address')
  
  cardHintEl = document.getElementById('card_hint')
  nameHintEl = document.getElementById('name_hint')
  paternalSurnameHintEl = document.getElementById('paternal_surname_hint')
  maternalSurnameHintEl = document.getElementById('maternal_surname_hint')
  phoneHintEl = document.getElementById('phone_hint')
  stateHintEl = document.getElementById('state_hint')
  townHintEl = document.getElementById('town_hint')
  sectionHintEl = document.getElementById('section_hint')
  addressHintEl = document.getElementById('address_hint')
  
  cardErrorEl = document.getElementById('card_error')
  nameErrorEl = document.getElementById('name_error')
  paternalSurnameErrorEl = document.getElementById('paternal_surname_error')
  maternalSurnameErrorEl = document.getElementById('maternal_surname_error')
  phoneErrorEl = document.getElementById('phone_error')
  stateErrorEl = document.getElementById('state_error')
  townErrorEl = document.getElementById('town_error')
  sectionErrorEl = document.getElementById('section_error')
  addressErrorEl = document.getElementById('address_error')
  
  stateEl.addEventListener('onchange', onChangeSelect, true)

  cardEl.addEventListener('change', onKeyup, true)
  nameEl.addEventListener('keyup', onKeyup, true)
  paternalSurnameEl.addEventListener('keyup', onKeyup, true)
  maternalSurnameEl.addEventListener('keyup', onKeyup, true)
  phoneEl.addEventListener('keyup', onKeyup, true)
  stateEl.addEventListener('onchange', onKeyup, true)
  townEl.addEventListener('onchange', onKeyup, true)
  sectionEl.addEventListener('keyup', onKeyup, true)
  addressEl.addEventListener('keyup', onKeyup, true)

  registryFormEl.addEventListener('submit', onSubmit, true)
})
