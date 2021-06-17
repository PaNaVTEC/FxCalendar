const Discord = require("discord.js")
const keepAlive = require("./server")

const {
  todayEventsForMessage,
  nextWeekEventsForMessage
} = require("./todayEvents")
const {
  sendDogeGif
} = require("./giphy")
const {
  scheduleDailyEvents,
  scheduleNextWeekEvents,
  scheduleWallStreetOpen,
  scheduleLondonOpen,
  scheduleNyOpen,
  scheduleLondonKillZone,
  scheduleNyKillZone
} = require("./scheduledTasks")
const { marketPerformance } = require("./marketPerformance")

const client = new Discord.Client()

client.on("ready", () => {
  scheduleDailyEvents(client)
  scheduleNextWeekEvents(client)
  scheduleLondonOpen(client)
  scheduleNyOpen(client)
  scheduleLondonKillZone(client)
  scheduleNyKillZone(client)
  console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", msg => {
  switch(msg.content) {
    case '!help': 
      msg.reply(`Actual commands:\n!ping\n!doge\n!today-events\n!next-week-events`)
      break
    case '!ping':
      msg.reply("pong")
      break
    case '!today-events':
      todayEventsForMessage(msg)
      break
    case '!doge':
      sendDogeGif(msg)
      break
    case '!next-week-events':
      nextWeekEventsForMessage(msg)
      break
  }
})

keepAlive()
client.login(process.env.TOKEN)