import NODE_CRON from 'node-cron'

const CRON_TASKS = []


const add = (time, cronTaskFunction) => {
  let task = NODE_CRON.schedule(time, cronTaskFunction, {
    scheduled: true,
    timezone: 'America/Mexico_City',
  })
  CRON_TASKS.push(task)
}

const getTasks = () => {
  return CRON_TASKS
}

export default {
  add: add,
  getTasks: getTasks,
}


// NOTE: CRON TIME
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

// 0/10 * * * * * EVERY 10 SECONDS STARTING IN 0

// Allowed values
// field  value
// second  0-59
// minute  0-59
// hour  0-23
// day of month  1-31
// month  1-12 (or names)
// day of week  0-7 (or names, 0 or 7 are sunday)

// NOTE: EXAMPLE
// import cron from './lib/cron.js'
// cron.add('*/1 * * * * *', () => {
//   console.log('= cron every 1 sec =')
// })
