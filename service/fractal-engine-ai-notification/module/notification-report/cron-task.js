const xlsx = require('xlsx')
const APP_CONFIG = require('../../config')
const lib = require('../../lib/lib')
const mail = require('../../lib/mail')
const repository = require('./repository')
const directory = require('../../lib/directory')


let HTML_EMAIL_TEMPLATE = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

    <style type="text/css">
      @media only screen and (min-width: 620px) {
  .u-row {
    width: 600px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 600px !important;
  }

}

@media (max-width: 620px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
  }
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 85% !important; } #u_content_text_1 .v-container-padding-padding { padding: 60px 10px 10px !important; } #u_content_text_2 .v-container-padding-padding { padding: 10px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px !important; } #u_content_button_1 .v-size-width { width: 65% !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 10px 30px !important; } }
    </style>



<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->


<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 480px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

<table id="u_content_image_1" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;" align="left">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      <a href="DOMAIN" target="_blank">
      <img align="center" border="0" src="REPLACE_IMAGE_URL" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 15%;max-width: 87px;" width="87" class="v-src-width v-src-max-width"/>
      </a>
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_1" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 30px 10px;font-family:'Open Sans',sans-serif;" align="left">

  <div style="font-size: 14px; line-height: 140%; text-align: justify; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"><strong>REPLACE_TITLE</strong></p>
<p style="font-size: 14px; line-height: 140%;"> </p>
<p style="font-size: 14px; line-height: 140%;">REPLACE_DESCRIPTION</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">

  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_2" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Open Sans',sans-serif;" align="left">

  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"><strong>Reportes:</strong></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_button_1" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Open Sans',sans-serif;" align="left">

  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div align="left">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:35px; v-text-anchor:middle; width:280px;" arcsize="0%"  stroke="f" fillcolor="#212121"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
    REPLACE_BUTTONS
  <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">

  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_3" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 60px 30px;font-family:'Open Sans',sans-serif;" align="left">

  <div style="font-size: 14px; color: #212121; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"> </p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="color: #000000; line-height: 19.6px;">GENERADO: REPLACE_CURRENT_DATE</span></p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"><a href="REPLACE_DOMAIN" target="_blank"></a><strong>ceemich.com</strong></p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"> </p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="color: #000000; line-height: 19.6px;">NO RESPONDER A ESTE CORREO.</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>
`


const brigadeReport = async (currentDate, startDate, endDate, fortnightStartDate, fortnightEndDate, fortnightMeta, emails) => {
  let resultData = {
  }
  try {
    let currentDateFormated = lib.formatDate(currentDate).replace(' ', '_')
    let startDateFormated = lib.formatDate(startDate)
    let endDateFormated = lib.formatDate(endDate)
    let fortnightStartDateFormated = lib.formatDate(fortnightStartDate)
    let fortnightEndDateFormated = lib.formatDate(fortnightEndDate)

    // NOTE: CREATE DIRECTORY
    let reportDirectoryPath = `${ APP_CONFIG.reportDirectory }${ currentDateFormated }`
    await directory.createFolderFromPath(reportDirectoryPath)
    // NOTE: REQUEST ALL REPORTS
    let reportURL = `${ APP_CONFIG.hostURL }/static/storage/reports/`
    let propName = ''
    let userId = 2 // NOTE: national id
    let mailReportLinks = []
    let states = await repository.fetchState()
    for (let state of states) {
      let items = await repository.brigadeStateReport({
        user_id: userId,
        state_id: state.id,
        start_date: startDateFormated,
        end_date: endDateFormated,
        fortnight_start_date: fortnightStartDateFormated,
        fortnight_end_date: fortnightEndDateFormated,
        prop_name: propName,
      })
      if (items.length === 0)
        continue

      // NOTE: CALC METAS AND TOTALS
      let totalA = 0
      let totalB = 0
      let totalC = 0
      for (let k in items) {
        let total = parseInt(items[k]['TOTAL'])
        let fortnightTotal = parseInt(items[k]['ACUMULADO'])
        if (total >= 15) {
          items[k]['META (15)'] = ((total >= 15)?'SI':'NO')
          totalA++
        } else if (total >= 20) {
          items[k]['META (20)'] = ((total >= 20)?'SI':'NO')
          totalB++
        } else if (total >= 25) {
          items[k]['META (25)'] = ((total >= 25)?'SI':'NO')
          totalC++
        }
        items[k]['PORCENTAJE'] = fortnightTotal * 100 / fortnightMeta
      }
      if (items.length < 6) {
        for (let r=items.length; r<=6; r++)
          items[r] = {
            'ID': 0,
            'NOMBRE:': '',
            'TOTAL': '',
            'META (15)': '',
            'META (20)': '',
            'META (25)': '',
            'ACUMULADO': '',
            'PORCENTAJE': '',
            '': '',
            'DATO': '-',
            'VALOR': '-',
          }
      }
      items[0]['DATO'] = 'META DIARIA'
      items[0]['VALOR'] = 15
      items[1]['DATO'] = 'META QUINCENAL'
      items[1]['VALOR'] = fortnightMeta
      items[2]['DATO'] = 'FECHA (TOTAL)'
      items[2]['VALOR'] = `DEL ${ startDateFormated } AL ${ endDateFormated }`
      items[3]['DATO'] = 'FECHA (ACUMULADO)'
      items[3]['VALOR'] = `DEL ${ fortnightStartDateFormated } AL ${ fortnightEndDateFormated }`,
      items[4]['DATO'] = 'TOTAL (>15)'
      items[4]['VALOR'] = totalA
      items[5]['DATO'] = 'TOTAL (>20)'
      items[5]['VALOR'] = totalB
      items[6]['DATO'] = 'TOTAL (>25)'
      items[6]['VALOR'] = totalC

      // NOTE: GENERATE XLSX FROM DATA
      let filePath = `${ reportDirectoryPath }`
      let fileName = `${ state.id }-${ state.name }`
      let fileURL = `${ reportURL }${ currentDateFormated }/${ fileName }.xlsx`
      await generateXLSX(filePath, fileName, sheetName = 'sheet 1', items)
      mailReportLinks.push({
        name: `${ fileName }.xlsx`,
        url: fileURL,
      })
    }
    // NOTE: CREATE MAIL CONTENT
    let logoURL = `${ APP_CONFIG.hostURL }/static/assets/fractal-engine-ai-logo.png`
    let htmlEmailTemplate = HTML_EMAIL_TEMPLATE
    let htmlButtons = ''
    for (let report of mailReportLinks)
      htmlButtons += `
    <a href="${ report.url }" download="${ report.name } target="_blank" class="v-button v-size-width" style="box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #212121; border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px; width:50%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span style="display:block;padding:10px 20px;line-height:110%;"><strong><span style="font-size: 14px; line-height: 15.4px;">${ report.name }</span></strong></span>
    </a>
    <br />
    <br />`
    currentDateFormated = currentDateFormated.replace('_', ' ')
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_TITLE', currentDateFormated)
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_DESCRIPTION', `
      <br/>REPORTE DE AVANCE DE BRIGADISTAS POR ESTADO.
      <br/>AVANCE DE HOY DEL <strong>${ startDateFormated }</strong> AL <strong>${ endDateFormated }</strong>.
      <br/>AVANCE ACUMULADO DEL <strong>${ fortnightStartDateFormated }</strong> AL <strong>${ fortnightEndDateFormated }</strong>.`)
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_IMAGE_URL', logoURL)
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_CURRENT_DATE', currentDateFormated)
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_DOMAIN', APP_CONFIG.hostURL)
    htmlEmailTemplate = htmlEmailTemplate.replace('REPLACE_BUTTONS', htmlButtons)
    let emailSubject = `AA - REPORTE - ${ currentDateFormated }`
    // NOTE: SEND REPORT TO MAILS
    let accepted = []
    let rejected = []
    let errors = []
    for (let email of emails) {
      let result = await mail.sendEmail({
        to: email,
        subject: emailSubject,
        html: htmlEmailTemplate,
      })
      if (result.error !== null)
        errors.push(result.error.code)
      else {
        accepted.push(result.data.accepted)
        rejected.push(result.data.rejected)
      }
    }
    resultData = {
      accepted: accepted,
      rejected: rejected,
      errors: errors,
    }
  } catch (err) {
    console.error(err)
    resultData.error = err
  } finally {
    return resultData
  }
}

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
// https://cronjob.xyz

exports.brigateReportA = {
  name: 'brigade-day-report-22hrs',
  cronTime: '0 22 * * *',
  onTick: async () => {
    let reportRecord = await repository.getNotificationReport({ name: 'brigade-day-report-22hrs' })
    if (!Object.keys(reportRecord).length)
      return

    if (!reportRecord.active)
      return

    if (!reportRecord.email.length)
      return

    let emails = []
    for (let i of reportRecord.email)
      emails.push(i.value)
    let currentDate = new Date()
    let fortnightStartDate = new Date(lib.formatDate(currentDate))
    let fortnightEndDate = new Date(lib.formatDate(currentDate))
    let startDate = new Date()
    let endDate = new Date()
    let fortnightMeta = 0
    let totalDays = 0
    startDate.setDate(startDate.getDate() - 1)
    startDate.setHours(22, 00, 00)
    endDate.setHours(22, 00, 00)
    let currentDayNumber = parseInt(lib.formatDate(currentDate).split(' ')[0].split('-')[2])
    let isFirstFortnight = true
    if (currentDayNumber <= 15) {
      fortnightStartDate.setHours(22, 00, 00)
      fortnightStartDate.setDate(0)
      fortnightEndDate.setHours(22, 00, 00)
    } else {
      fortnightStartDate.setHours(22, 00, 00)
      fortnightStartDate.setDate(15)
      fortnightEndDate.setHours(22, 00, 00)
      isFirstFortnight = false
    }
    let startMonth = new Date(fortnightStartDate)
    let endMonth = new Date(fortnightStartDate)
    if (isFirstFortnight)
      endMonth.setDate(endMonth.getDate() + 14)
    else {
      endMonth.setMonth(endMonth.getMonth() + 1)
      endMonth.setDate(-1)
    }
    totalDays = getTotalDays(new Date(startMonth), new Date(endMonth))
    fortnightMeta = totalDays * 15 // NOTE: 15 IS THE META DAYLY
    return await brigadeReport(currentDate, startDate, endDate, fortnightStartDate, fortnightEndDate, fortnightMeta, emails)
  },
}

const generateXLSX = async (path = '', fileName = 'file', sheetName = 'sheet 1', jsonData = []) => {
  const workBook = xlsx.utils.book_new()
  let res = null
  try {
    const workSheet = xlsx.utils.json_to_sheet(jsonData)
    await xlsx.utils.book_append_sheet(workBook, workSheet, sheetName, true)
    res = await xlsx.writeFile(workBook, `${ path }/${ fileName }.xlsx`)
  } catch (err) {
    console.error(err)
    res = err.toString()
  } finally {
    return res
  }
}

const getTotalDays = (startDate, endDate) => {
  let total = 0
  let match = false
  let startDateFormated = ''
  let endDateFormated = lib.formatDate(endDate)
  let totalDays = 0
  while (!match) {
    if (parseInt(startDate.getDay()) === 0)
      total++
    startDateFormated = lib.formatDate(startDate)
    if (startDateFormated === endDateFormated)
      match = true
    startDate.setDate(startDate.getDate() + 1)
    totalDays++
  }
  return totalDays - total
}
