const { todayEventsForMessage, nextWeekEventsForMessage } = require("./economicEvents")
const { sendDogeGif } = require("./giphy")
const { sectorPerformanceForMessage } = require("./marketPerformance")

const prefix = '!'
const handlers = {
  [`${prefix}help`]: msg => msg.reply(`Commands:\n${Object.keys(handlers).join('\n')}`),
  [`${prefix}ping`]: msg => msg.reply('pong'),
  [`${prefix}todayEvents`]: todayEventsForMessage,
  [`${prefix}doge`]: sendDogeGif,
  [`${prefix}nextWeekEvents`]: nextWeekEventsForMessage,
  [`${prefix}sectorPerformance`]: sectorPerformanceForMessage,
}

const handler = msg => handlers[msg.content] && handlers[msg.content](msg)

module.exports = {
  handler
}