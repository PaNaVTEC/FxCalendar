const Discord = require("discord.js")
const keepAlive = require("./server")
const { scheduleTasks } = require("./scheduledTasks")
const { handler } = require("./commandHandlers")

const client = new Discord.Client()

client.on("ready", () => {
  scheduleTasks(client)
  console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", handler)

client
  .login(process.env.TOKEN)
  .then(_ => keepAlive())