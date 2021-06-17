const fetch = require("node-fetch")
const cheerio = require("cheerio")
const moment = require("moment-timezone")

const groupByFn = (key, fn, xs) => 
  xs.reduce((rv, x) => {
    (rv[fn(x[key])] = rv[fn(x[key])] || []).push(x);
    return rv;
  }, {});
const groupBy = (key, xs) => groupByFn(key, a => a, xs)

const currentWeekEventsUrl = () =>
  `https://www.babypips.com/economic-calendar?timezone=Europe%2FMadrid&week=${moment().year()}-W${moment().week() - 1}`

const nextWeekEventsUrl = () =>
  `https://www.babypips.com/economic-calendar?timezone=Europe%2FMadrid&week=${moment().year()}-W${moment().week()}`

const fetchEvents = url =>
  fetch(url)
  .then(res => res.text())
  .then(res => {
    const $ = cheerio.load(res)
    const data = JSON.parse($('div[data-react-class=Calendar]').attr('data-react-props'))
    return data.events
  })

const formatEvents = evs =>
  evs
    .map(ev => `:flag_${ev.country.toLocaleLowerCase()}: ${moment(ev.starts_at, moment.DATETIME_LOCAL_MS).tz("Europe/Madrid").format('HH:mm')} :watch: ${(ev.name || '').substring(0, 30)}`)
    .join('\n')

const eventsToSummary = (day, url, groupedEvs) => {
  if (!groupedEvs.med && !groupedEvs.high)
    return [
      `No events for ${day} were found`
    ]
  
  return [
    `Summary of events for ${day}\n${!groupedEvs.med ? '' : 'Importance :yellow_square:\n'}`,
    !groupedEvs.med ? undefined : formatEvents(groupedEvs.med) + '\n',
    !groupedEvs.high ? undefined : `Importance :red_square:\n${formatEvents(groupedEvs.high)}\n`
  ].filter(a => a)
}
  
const todayEventsForMessage = msg => {
  msg.react('🤔')
  todayEvents().then(msgs => msgs.forEach(m => msg.channel.send(m)))
}

const todayEvents = () => 
  fetchEvents(currentWeekEventsUrl())
    .then(events =>
      groupBy(
        'impact',
        events.filter(ev => moment(ev.starts_at, moment.DATETIME_LOCAL_MS).date() === moment().date())
      )
    )
    .then(groupedEvs => eventsToSummary(moment().format("DD-MM"), currentWeekEventsUrl(), groupedEvs))

const nextWeekEvents = () =>
  fetchEvents(nextWeekEventsUrl())
    .then(events =>
      groupByFn(
        'starts_at',
        startsAt => moment(startsAt, moment.DATETIME_LOCAL_MS).format("DD-MM"),
        events
      )
    )
    .then(evsByDay => 
      Object
        .keys(evsByDay)
        .map(day => 
          eventsToSummary(
            day,
            nextWeekEventsUrl(),
            groupBy('impact', evsByDay[day])
          )
        )  
    )

const nextWeekEventsForMessage = msg => {
  msg.react('🤔')
  nextWeekEvents().then(msgs => msgs.forEach(m => msg.channel.send(m)))
}

module.exports = {
  todayEventsForMessage,
  todayEvents,
  nextWeekEventsForMessage,
  nextWeekEvents
}