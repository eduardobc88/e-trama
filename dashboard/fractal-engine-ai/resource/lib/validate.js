import {
  length,
  string,
} from '../base-mc/vue-mc/validation'


const MAIL_FORMAT_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g
const URL_PATH_REGEX = /^[a-zA-Z0-9]+[-a-zA-Z0-9]+[a-zA-Z0-9]+$/g

const validateMinInputString = (value, size) => {
  if (value.length === 0)
    return `Must have at least ${ size } characters`

  if (_.isNull(value))
    return `Must have at least ${ size } characters`

  if (value.length < size)
    return `Must have at least ${ size } characters`

  return ''
}

const validateDecimalNumber = (value, greaterThan = -1, required = false) => {
  if (value <= greaterThan && required)
    return 'Required'

  if (value <= greaterThan)
    return 'Must have a decimal number'

  let str = value.toString()
  let re = /^[-+]?[0-9]+(\.[0-9]+)*$/
  let result = re.test(str)
  if (!result)
    return 'Must have a decimal number'

  return ''
}

const validateNumber = (value, greaterThan = -1, required = false) => {
  if (value <= greaterThan && required)
    return 'Required'

  if (value <= greaterThan)
    return 'Must have a number'

  let str = value.toString()
  let re = /^[-+]?[0-9]+$/
  let result = re.test(str)
  if (!result)
    return 'Must have a number'

  return ''
}

const validateMinNumber = (value, greaterThan = 0, errorMsg = '') => {
  if (value < greaterThan)
    return errorMsg

  return ''
}

const validateInputSelectValue = (value, required = false) => {
  let errorMessage = 'Select a option'
  if (!value && required)
    return errorMessage

  if (!required)
    return ''

  if (value <= 0)
    return errorMessage

  return ''
}

const validateMultiselect = (items, min = 1) => {
  let errorMessage = 'Select a option'
  if (items === null || items.length < min)
    return errorMessage

  return ''
}

const validateInputMultiSelectValue = (value, required = false) => {
  let errorMessage = 'Select a option'
  if (!Array.isArray(value))
    return errorMessage

  if (value.length === 0)
    return errorMessage

  return ''
}

const validateNestedInputSelect = (valueA, valueB) => {
  if (valueA === 0 || valueA === '')
    return 'Select a option from last select'

  if (valueB === 0 || valueB === '')
    return 'Select a option'

  return ''
}

const validateEmail = (value, required = false) => {
  if (value.length === 0 && required)
    return 'Required'

  if (value.length === 0)
    return ''

  if (value.match(MAIL_FORMAT_REGEX) === null)
    return 'Insert a valid email'

  return ''
}

const validateURL = (value, required) => {
  let valueLength = value.length
  if (required && !valueLength)
    return 'Required'

  if (!valueLength)
    return ''

  let result = value.match(URL_REGEX)
  if (result === null)
    return 'Invalid URL'

  return ''
}

const validatePathURL = (value, required) => {
  let valueLength = value.length
  if (required && !valueLength)
    return 'Required'

  if (!valueLength)
    return ''

  let result = value.match(URL_PATH_REGEX)
  if (result === null)
    return 'Invalid path'

  return ''
}

export default {
  validateMinInputString: validateMinInputString,
  validateInputSelectValue, validateInputSelectValue,
  validateNestedInputSelect: validateNestedInputSelect,
  validateDecimalNumber: validateDecimalNumber,
  validateEmail: validateEmail,
  validateURL: validateURL,
  validatePathURL: validatePathURL,
  validateNumber: validateNumber,
  validateInputMultiSelectValue: validateInputMultiSelectValue,
  validateMultiselect: validateMultiselect,
  validateMinNumber: validateMinNumber,
}
