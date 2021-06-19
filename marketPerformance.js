const { parseString } = require('@fast-csv/parse')
const fetch = require("node-fetch")
const { table } = require('table')

// This would work if replit did support puppeter, but for now :shrug:
//const puppeteer = require('puppeteer')
//const marketPerformance = async msg => {
//  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//  const page = await browser.newPage();
//  await page.goto(url);
//  const buffer = await page.screenshot();
//  msg.channel.send('Market Performance', new MessageAttachment(buffer, 'marketPerformance.png'))
//}

const readCsvString = csvString => 
  new Promise(function(resolve, reject) {
    const dataFromCsv = []
    parseString(csvString, { headers: true })
      .on('error', reject)
      .on('data', row => dataFromCsv.push(row))
      .on('end', () => resolve(dataFromCsv))
  })

const format = sectors => {
  const headerRow = ['Name', 'P/E', 'Day', 'Week', 'Month', 'Year']
  const sectorsFmt = sectors.map(s => [s['Name'], s['P/E'], s['Change'], s['Performance (Week)'], s['Performance (Month)'], s['Performance (Year)']])
  const m = table([headerRow].concat(sectorsFmt))
  return 'Sector Performance\n```\n' + m + '\n```'
}

const sectorPerformance = () =>
  fetch(
    'https://finviz.com/grp_export.ashx?g=sector&v=152&o=change', 
    { method: 'GET', 
      headers: { 
        'cookie': 'screenerUrl=screener.ashx?v=111&f=sec_basicmaterials; customTableGroups=1,3,15,16,19,24; pv_count=98'
      }
    }
  )
    .then(res => res.text())
    .then(readCsvString)
    .then(format)

const sectorPerformanceForMessage = msg => {
  msg.react('🤔')
  sectorPerformance().then(m => msg.channel.send(m))
}

module.exports = {
  sectorPerformance,
  sectorPerformanceForMessage
}