const express = require('express')

module.exports = () => {
  const server = express()
  server.all('/alive', (_req, res) => {
    res.send('Your bot is alive!')
  })
  server.listen(3000, () => { console.log("Keep alive server is Ready!") })
}