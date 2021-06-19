const puppeteer = require('puppeteer')

const marketPerformance = async msg => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  const page = await browser.newPage();
  await page.goto(url);

  const buffer = await page.screenshot();

  msg.channel.send('Market Performance', new MessageAttachment(buffer, 'marketPerformance.png'))
}

module.exports = {
  marketPerformance
}