const cron = require('cron')
const { todayEvents, nextWeekEvents } = require("./economicEvents")

const sendMessageAt = (client, cronRegex, msg) => sendMessageFn(client, cronRegex, channel => channel.send(msg))
const sendMessageFn = (client, cronRegex, channelSend) => new cron.CronJob(cronRegex, () => {
  client.guilds.cache.each(guild => {
    const channel = guild.channels.cache.find(channel => channel.name === 'general')
    channelSend(channel)
  })
}, null, true, 'Europe/Madrid')

const scheduleDailyEvents = client =>
  sendMessageFn(client, '0 5 * * 1-5', channel => todayEvents().then(msgs => msgs.forEach(m => channel.send(m)))).start()

const scheduleNextWeekEvents = client =>
  sendMessageFn(client, '0 20 * * 6', channel => nextWeekEvents().then(msgs => msgs.forEach(m => channel.send(m)))).start()

const scheduleLondonOpen = client =>
  sendMessageAt(client, '58 8 * * 1-5', ':flag_gb: London open! :bell:').start();

const scheduleLondonKillZone = client =>
  sendMessageAt(client, '58 6 * * 1-5', ':flag_gb: London killzone! :bell:').start();

const scheduleNyOpen = client =>
  sendMessageAt(client, '28 15 * * 1-5', ':flag_us: NY open! :bell:').start();

const scheduleNyKillZone = client =>
  sendMessageAt(client, '58 12 * * 1-5', ':flag_us: NY killzone! :bell:').start();

const scheduleTasks = client => {
  scheduleDailyEvents(client)
  scheduleNextWeekEvents(client)
  scheduleLondonOpen(client)
  scheduleNyOpen(client)
  scheduleLondonKillZone(client)
  scheduleNyKillZone(client)
}

module.exports = {
  scheduleTasks
}