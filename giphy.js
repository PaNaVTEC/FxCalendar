const GphApiClient  = require('giphy-js-sdk-core')
const giphy = GphApiClient(process.env.GIPHY_TOKEN)

const sendDogeGif = msg =>
  giphy
    .random('gifs', {tag: 'doge'})
    .then(res => msg.channel.send(res.data.url))

module.exports = {
  sendDogeGif
}