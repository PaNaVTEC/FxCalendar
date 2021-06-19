const { todayEventsForMessage, nextWeekEventsForMessage } = require("./economicEvents")
const { sendDogeGif } = require("./giphy")
const { marketPerformance } = require("./marketPerformance")

const prefix = '!'
const handlers = {
  [`${prefix}help`]: msg => msg.reply(`Actual commands:\n!ping\n!doge\n!today-events\n!next-week-events`),
  [`${prefix}ping`]: msg => msg.reply('pong'),
  [`${prefix}todayEvents`]: todayEventsForMessage,
  [`${prefix}doge`]: sendDogeGif,
  [`${prefix}nextWeekEvents`]: nextWeekEventsForMessage,
  [`${prefix}marketPerformance`]: marketPerformance
}

const handler = msg => handlers[msg.content] && handlers[msg.content](msg)

module.exports = {
  handler
}