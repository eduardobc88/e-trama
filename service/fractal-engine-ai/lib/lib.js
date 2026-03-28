
const formatDate = dateObj => {
  let localDate = dateObj.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    timeZone: "America/Mexico_City",
  })
  let localDateArr = localDate.split(', ')
  let leftArr = localDateArr[0].split('/')
  date = leftArr[0]
  month = leftArr[1]
  year = leftArr[2]
  return `${ year }-${ month }-${ date } ${ localDateArr[1] }`
}

export default {
  formatDate: formatDate,
}