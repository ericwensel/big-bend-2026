/* ==========================================================================
   Big Bend or Bust!  ·  app.js
   Vanilla JS, no dependencies, no build step. Works on GitHub Pages
   Sections: config → helpers → countdown → right-now → weather → packing
             → photo lightbox → mobile nav → boot
   ========================================================================== */
'use strict';

/* ------------------------------------------------------------------ config */

/* Everything runs on Central time. Nov 13–17, 2026 falls after the DST
   change, so every offset below is -06:00 (CST). */
var TRIP = {
  timeZone: 'America/Chicago',
  startISO: '2026-11-13T07:00:00-06:00',   // wheels up
  endISO: '2026-11-18T02:00:00-06:00',     // home and asleep
  planningStartISO: '2026-10-15T00:00:00-05:00',
  days: ['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17']
};

/* Each agenda item drives the "right now" cards. */
var SCHEDULE = [
  { start: '2026-11-13T07:00:00-06:00', end: '2026-11-13T18:00:00-06:00', icon: '🚙', time: '7:00 AM',
    title: 'Drive to Lajitas', place: 'The open road → Lajitas, TX',
    note: 'Gas up, snacks in the door pocket, playlist queued. Aim to be checked in before dark.' },
  { start: '2026-11-13T18:00:00-06:00', end: '2026-11-13T19:30:00-06:00', icon: '🏨', time: 'Evening',
    title: 'Check in to Lajitas Golf Resort', place: 'Lajitas, TX · on the Rio Grande',
    note: 'Historic resort right on the river. Drop the bags, find the porch, breathe.' },
  { start: '2026-11-13T19:30:00-06:00', end: '2026-11-13T21:30:00-06:00', icon: '🍽️', time: '7:30 PM',
    title: 'Dinner at the Lajitas Golf Resort Restaurant', place: 'On property',
    note: 'No cooking tonight — that starts tomorrow.' },
  { start: '2026-11-14T07:30:00-06:00', end: '2026-11-14T09:00:00-06:00', icon: '☕', time: 'Morning',
    title: 'Breakfast at Venga Cafe', place: 'Terlingua Ghost Town',
    note: 'Local coffee, fresh pastries, breakfast tacos. Wander the ghost town and cemetery while you are there.' },
  { start: '2026-11-14T09:00:00-06:00', end: '2026-11-14T12:30:00-06:00', icon: '🚙', time: 'Midday',
    title: 'Drive into the park & stock up', place: 'Terlingua → Chisos Basin',
    note: 'Fill every water container you own before heading up. There is no water at the campground.' },
  { start: '2026-11-14T13:00:00-06:00', end: '2026-11-14T15:00:00-06:00', icon: '⛺', time: '1:00 PM',
    title: 'Check in at Chisos Basin Campground', place: 'Chisos Basin · ~5,400 ft',
    note: 'Tent up, stakes deep — the basin gets wind. Food goes straight into the bear box.' },
  { start: '2026-11-14T15:45:00-06:00', end: '2026-11-14T18:15:00-06:00', icon: '🥾', time: '3:45 PM',
    title: 'Window Trail hike', place: 'Chisos Basin trailhead',
    note: 'Roughly 5.5 miles round trip down to the pour-off. Great warm-up with a big finish.' },
  { start: '2026-11-14T19:30:00-06:00', end: '2026-11-14T21:30:00-06:00', icon: '🌮', time: '7:30 PM',
    title: 'Dinner in the basin', place: 'Chisos Basin',
    note: 'Eat, then kill every light you can and look up.' },
  { start: '2026-11-15T07:00:00-06:00', end: '2026-11-15T08:15:00-06:00', icon: '🍳', time: '7:00 AM',
    title: 'Early breakfast in the basin', place: 'Chisos Basin',
    note: 'Coffee first. Then boots.' },
  { start: '2026-11-15T08:30:00-06:00', end: '2026-11-15T16:30:00-06:00', icon: '🏔️', time: '8:30 AM',
    title: 'South Rim Trail — the crown jewel', place: 'Chisos Mountains · up to ~7,200 ft',
    note: 'A long day out: water, electrolytes, layers, headlamp as insurance. The view straight down into Mexico is the whole point of this trip.' },
  { start: '2026-11-15T16:30:00-06:00', end: '2026-11-15T19:00:00-06:00', icon: '🪑', time: 'Afternoon',
    title: 'Back at camp — rest', place: 'Chisos Basin',
    note: 'Feet up, camp slippers on, zero regrets.' },
  { start: '2026-11-15T19:00:00-06:00', end: '2026-11-15T21:30:00-06:00', icon: '🔥', time: 'Evening',
    title: 'Dinner at camp', place: 'Chisos Basin',
    note: 'Last full night in the basin — make it a long one.' },
  { start: '2026-11-16T07:00:00-06:00', end: '2026-11-16T08:45:00-06:00', icon: '🎒', time: '7:00 AM',
    title: 'Early start — pack up camp', place: 'Chisos Basin',
    note: 'Tear down, sweep the site, leave no trace (and no crumbs for the javelinas).' },
  { start: '2026-11-16T09:00:00-06:00', end: '2026-11-16T12:00:00-06:00', icon: '⛰️', time: '9:00 AM',
    title: 'Lost Mine Trail hike', place: 'Lost Mine trailhead',
    note: 'The best payoff-per-mile in the park. Back at the trailhead by noon.' },
  { start: '2026-11-16T13:00:00-06:00', end: '2026-11-16T14:30:00-06:00', icon: '🍖', time: '1:00 PM',
    title: 'Lunch at DB’s Rustic Iron BBQ', place: 'Terlingua, TX',
    note: 'Brisket, ribs, and a nap in the passenger seat right afterward.' },
  { start: '2026-11-16T14:30:00-06:00', end: '2026-11-16T16:00:00-06:00', icon: '🚙', time: 'Afternoon',
    title: 'Scenic drive to Marathon', place: 'Big Bend → Marathon',
    note: 'Take the long, gorgeous way if the light is right.' },
  { start: '2026-11-16T16:00:00-06:00', end: '2026-11-16T19:30:00-06:00', icon: '🏨', time: '4:00 PM',
    title: 'Check in at the Gage Hotel', place: 'Marathon, TX',
    note: 'Hot shower, real bed, air conditioning. Civilization — briefly.' },
  { start: '2026-11-16T19:30:00-06:00', end: '2026-11-16T21:30:00-06:00', icon: '🍸', time: '7:30 PM',
    title: 'Dinner at the Gage Hotel', place: 'Marathon, TX',
    note: 'Have a drink at the bar first — the buffalo head is watching you.' },
  { start: '2026-11-17T09:00:00-06:00', end: '2026-11-17T10:30:00-06:00', icon: '🥞', time: '9:00 AM',
    title: 'Breakfast at the Gage Hotel', place: 'Marathon, TX',
    note: 'Relaxed breakfast, then load the car one last time.' },
  { start: '2026-11-17T10:30:00-06:00', end: '2026-11-17T22:00:00-06:00', icon: '🛣️', time: 'Late morning',
    title: 'Drive home', place: 'Marathon → home',
    note: 'The long road is the most scenic drive in Texas — per Gemini, absolutely worth the extra 1.5 hours.' }
];

/* Highlights for the countdown card. */
var MILESTONES = [
  { at: '2026-11-13T07:00:00-06:00', icon: '🚙', label: 'Leave the driveway' },
  { at: '2026-11-13T18:00:00-06:00', icon: '🏨', label: 'Check in at Lajitas Golf Resort' },
  { at: '2026-11-14T08:00:00-06:00', icon: '☕', label: 'Breakfast at Venga Cafe' },
  { at: '2026-11-14T13:00:00-06:00', icon: '⛺', label: 'Chisos Basin campsite claimed' },
  { at: '2026-11-14T15:45:00-06:00', icon: '🥾', label: 'Window Trail' },
  { at: '2026-11-15T08:30:00-06:00', icon: '🏔️', label: 'South Rim Trail — the big one' },
  { at: '2026-11-16T09:00:00-06:00', icon: '⛰️', label: 'Lost Mine Trail' },
  { at: '2026-11-16T13:00:00-06:00', icon: '🍖', label: 'DB’s Rustic Iron BBQ' },
  { at: '2026-11-16T16:00:00-06:00', icon: '🏨', label: 'Gage Hotel check-in' },
  { at: '2026-11-17T09:00:00-06:00', icon: '🥞', label: 'Breakfast at the Gage' },
  { at: '2026-11-17T11:00:00-06:00', icon: '🛣️', label: 'Homeward bound' }
];

/* Pre-trip nudges shown before departure. */
var PREP = [
  '🥾 Break in the boots — at least one long walk this week',
  '🔥 Test the camp stove and count your fuel canisters',
  '💧 Plan the water: 1 gallon per person per day, and there is none at camp',
  '🗺️ Print the topo maps, download offline maps, and leave your plan with someone at home'
];

/* ---------------------------------------------------------------- weather --
   Live Open-Meteo forecast when the trip dates fall inside the 16-day
   horizon; 5-year archive averages for anything further out. Free, no API key. */
var WX = {
  dates: ['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20'],
  tripDates: ['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17'],
  years: [2021, 2022, 2023, 2024, 2025],
  horizonDays: 15,               /* stay a day inside Open-Meteo's 16-day limit */
  cacheKey: 'bb26.weather.v1',
  ttlMs: 3 * 60 * 60 * 1000,
  places: [
    { key: 'lajitas', name: 'Lajitas / Terlingua', lat: 29.27, lon: -103.58 },
    { key: 'chisos', name: 'Chisos Basin', lat: 29.2712, lon: -103.3016 },
    { key: 'marathon', name: 'Marathon', lat: 30.2055, lon: -103.2446 }
  ],
  where: {
    '2026-11-13': 'Day 1 · Lajitas',
    '2026-11-14': 'Day 2 · Terlingua → Basin',
    '2026-11-15': 'Day 3 · Chisos Basin',
    '2026-11-16': 'Day 4 · Basin → Marathon',
    '2026-11-17': 'Day 5 · Marathon → home',
    '2026-11-18': 'Buffer day',
    '2026-11-19': 'Buffer day',
    '2026-11-20': 'Buffer day'
  }
};

var WX_ICONS = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌦️',
  56: '🌧️', 57: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌨️', 67: '🌨️', 71: '🌨️', 73: '🌨️',
  75: '❄️', 77: '❄️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 85: '🌨️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
};

/* ----------------------------------------------------------------- helpers */

function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function pad2(n) { return (n < 10 ? '0' : '') + n; }

/* Today's calendar date in Central time as YYYY-MM-DD. */
function centralToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TRIP.timeZone }).format(new Date());
}

function addDays(iso, n) {
  var d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dateParts(iso) {
  var d = new Date(iso + 'T12:00:00Z');
  return {
    dow: d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' }),
    mon: d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' }),
    day: d.getUTCDate()
  };
}

function split(ms) {
  ms = Math.max(0, ms);
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60
  };
}

/* "in 21d 9h" · "in 3h 12m" · "done 2h ago" */
function relText(target, now) {
  var ms = target - now, f;
  if (ms > 0) {
    f = split(ms);
    if (f.d > 0) return 'in ' + f.d + 'd ' + f.h + 'h';
    if (f.h > 0) return 'in ' + f.h + 'h ' + pad2(f.m) + 'm';
    return 'in ' + (f.m || 1) + 'm';
  }
  f = split(now - target);
  if (f.d > 0) return 'done ' + f.d + 'd ago';
  if (f.h > 0) return 'done ' + f.h + 'h ago';
  return 'just now';
}

function clockText(ms) {
  return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* localStorage that never throws (private mode, file://, etc.) */
function store(key, value) {
  try {
    if (value === undefined) {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }
    if (value === null) { localStorage.removeItem(key); return null; }
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (e) { return null; }
}

/* --------------------------------------------------------------- countdown */

function tripPhase(now) {
  if (now < new Date(TRIP.startISO).getTime()) return 'before';
  if (now < new Date(TRIP.endISO).getTime()) return 'during';
  return 'after';
}

function currentEvent(now) {
  for (var i = 0; i < SCHEDULE.length; i++) {
    if (now >= new Date(SCHEDULE[i].start).getTime() && now < new Date(SCHEDULE[i].end).getTime()) return SCHEDULE[i];
  }
  return null;
}

function nextEvent(now) {
  for (var i = 0; i < SCHEDULE.length; i++) {
    if (new Date(SCHEDULE[i].start).getTime() > now) return SCHEDULE[i];
  }
  return null;
}

function eventsToday(now) {
  var today = centralToday();
  return SCHEDULE.filter(function (e) { return e.start.slice(0, 10) === today; });
}

function tripDayNumber() {
  var idx = TRIP.days.indexOf(centralToday());
  return idx < 0 ? 0 : idx + 1;
}

function initCountdown() {
  var start = new Date(TRIP.startISO).getTime();
  var end = new Date(TRIP.endISO).getTime();
  var planStart = new Date(TRIP.planningStartISO).getTime();

  var chips = {
    days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'),
    minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]')
  };
  var heroStatus = $('#hero-status');
  var big = $('#cd-big');
  var sub = $('#cd-sub');
  var meter = $('#cd-meter');
  var legend = $('#cd-meter-legend');
  var statusCard = $('.card--status');
  var list = $('#milestones');
  var lastHero = '';

  if (list) {
    list.innerHTML = MILESTONES.map(function (m) {
      var t = new Date(m.at).getTime();
      var p = dateParts(m.at.slice(0, 10));
      return '<li data-at="' + t + '"><span class="m-what">' + m.icon + ' ' + esc(m.label) +
        '<span class="m-when">' + p.dow + ' ' + p.mon + ' ' + p.day + ' · ' + clockText(t) + '</span></span>' +
        '<span class="m-in">–</span></li>';
    }).join('');
  }
  var rows = list ? $$('li', list) : [];

  function setHero(text) {
    if (heroStatus && text !== lastHero) { heroStatus.textContent = text; lastHero = text; }
  }

  function paintMilestones(now) {
    var nextIdx = -1, i, at;
    for (i = 0; i < rows.length; i++) {
      at = Number(rows[i].getAttribute('data-at'));
      var out = $('.m-in', rows[i]);
      if (out) out.textContent = now >= at ? '✓ done' : relText(at, now);
      rows[i].className = now >= at ? 'is-done' : '';
      if (nextIdx < 0 && at > now) nextIdx = i;
    }
    if (nextIdx >= 0) rows[nextIdx].className = 'is-now';
  }

  function paintStatusCard(now) {
    if (!big) return;
    var phase = tripPhase(now), pct = 0, lbl = 'Trip progress', cls = '';
    if (phase === 'before') {
      var f = split(start - now);
      big.textContent = f.d + (f.d === 1 ? ' day to go' : ' days to go');
      sub.textContent = 'Roughly ' + f.d + ' days and ' + f.h + ' hours until the driveway empties out — ' +
        Math.max(1, Math.ceil((start - now) / 86400000)) + ' sleeps until Lajitas, then two nights under basin stars.';
      pct = planStart < start ? ((now - planStart) / (start - planStart)) * 100 : 0;
      lbl = 'Trip prep progress';
    } else if (phase === 'during') {
      big.textContent = 'Day ' + Math.max(1, tripDayNumber()) + ' of 5';
      var nxt = nextEvent(now);
      sub.textContent = nxt
        ? 'Next on the agenda: ' + nxt.title + ' ' + relText(new Date(nxt.start).getTime(), now) + '.'
        : 'Nothing left on today’s calendar — go watch the light change.';
      pct = ((now - start) / (end - start)) * 100;
      cls = 'is-live';
    } else {
      big.textContent = 'Trip complete 🌵';
      sub.textContent = 'Five days, three trails, two hotel beds and one tent. Time to start lobbying for the next one.';
      pct = 100; lbl = 'Home safe'; cls = 'is-done';
    }
    pct = Math.max(0, Math.min(100, pct));
    if (meter) meter.style.width = pct + '%';
    if (legend) legend.textContent = lbl + ' · ' + Math.round(pct) + '%';
    if (statusCard) {
      statusCard.classList.toggle('is-live', cls === 'is-live');
      statusCard.classList.toggle('is-done', cls === 'is-done');
    }
  }

  function tick() {
    var now = Date.now();
    var parts = split((now < start ? start : end) - now);
    if (chips.days) chips.days.textContent = String(parts.d);
    if (chips.hours) chips.hours.textContent = pad2(parts.h);
    if (chips.minutes) chips.minutes.textContent = pad2(parts.m);
    if (chips.seconds) chips.seconds.textContent = pad2(parts.s);

    var phase = tripPhase(now), cur = currentEvent(now), f;
    if (phase === 'before') {
      f = split(start - now);
      setHero(f.d === 0
        ? 'Today is the day — wheels up in ' + f.h + 'h ' + pad2(f.m) + 'm. 🚙'
        : 'T-minus ' + f.d + ' days, ' + f.h + ' hours until wheels up.');
    } else if (phase === 'during') {
      setHero('Day ' + Math.max(1, tripDayNumber()) + ' of 5' +
        (cur ? ' · right now: ' + cur.title : ' · between plans 😎'));
    } else {
      setHero('That trip is a wrap — what a run. 🌵');
    }

    paintMilestones(now);
    paintStatusCard(now);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------------- right now */

function initNow() {
  var nowCard = $('#now-card');
  var nextCard = $('#next-card');
  var laterList = $('#later-list');
  var nowDate = $('#now-date');
  if (!nowCard || !nextCard) return;

  var cache = {};
  function paint(el, html) {
    if (!el) return;
    if (cache[el.id] === html) return;
    cache[el.id] = html;
    el.innerHTML = html;
  }

  function longDate(iso) {
    return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US',
      { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function paintAll() {
    var now = Date.now();
    var start = new Date(TRIP.startISO).getTime();
    var phase = tripPhase(now);
    var today = centralToday();
    var p = dateParts(today);

    paint(nowDate, 'It is ' + clockText(now) + ' on ' + longDate(today) + ', Central time.');

    if (phase === 'before') {
      paint(nowCard,
        '<p class="now-label">Current status</p>' +
        '<span class="now-ico">🎒</span>' +
        '<h3 class="now-title">Pre-flight mode</h3>' +
        '<p class="now-place">Somewhere between “I should start packing” and “I have already packed twice.”</p>' +
        '<p class="now-note">Nothing on the itinerary yet. The only job this week is getting gear, body and water plan ready for the desert.</p>' +
        '<p class="now-time">Departure <span class="now-count">' + relText(start, now) + '</span> · Friday Nov 13, 7:00 AM</p>');
      paint(nextCard,
        '<p class="now-label">Get ahead of it</p>' +
        '<ul class="later">' + PREP.map(function (t) {
          return '<li><span>' + t + '</span></li>';
        }).join('') + '</ul>');
      paint(laterList, '<li><span>No scheduled stops today — work the packing list below and keep an eye on the forecast.</span></li>');
      return;
    }

    if (phase === 'during') {
      var cur = currentEvent(now);
      var nxt = nextEvent(now);

      if (cur) {
        paint(nowCard,
          '<p class="now-label">Right now</p>' +
          '<span class="now-ico">' + cur.icon + '</span>' +
          '<h3 class="now-title">' + esc(cur.title) + '</h3>' +
          '<p class="now-place">' + esc(cur.place) + ' · Day ' + Math.max(1, tripDayNumber()) + ' of 5</p>' +
          '<p class="now-note">' + esc(cur.note) + '</p>' +
          '<p class="now-time">' + esc(cur.time) + ' · wraps up around ' + clockText(new Date(cur.end).getTime()) +
          ' · <span class="now-count">' + relText(new Date(cur.end).getTime(), now) + '</span></p>');
      } else {
        paint(nowCard,
          '<p class="now-label">Right now</p>' +
          '<span class="now-ico">😎</span>' +
          '<h3 class="now-title">Between plans</h3>' +
          '<p class="now-place">' + p.dow + ' ' + p.mon + ' ' + p.day + ' · Day ' + Math.max(1, tripDayNumber()) + ' of 5</p>' +
          '<p class="now-note">Nothing scheduled this minute. Hydrate, snack, get off your feet — or start the next thing early.</p>');
      }

      if (nxt) {
        paint(nextCard,
          '<p class="now-label">Coming up next</p>' +
          '<span class="now-ico">' + nxt.icon + '</span>' +
          '<h3 class="now-title">' + esc(nxt.title) + '</h3>' +
          '<p class="now-place">' + esc(nxt.place) + '</p>' +
          '<p class="now-note">' + esc(nxt.note) + '</p>' +
          '<p class="now-time">Starts ' + clockText(new Date(nxt.start).getTime()) +
          ' · <span class="now-count">' + relText(new Date(nxt.start).getTime(), now) + '</span></p>');
      } else {
        paint(nextCard,
          '<p class="now-label">Coming up next</p>' +
          '<span class="now-ico">🏁</span>' +
          '<h3 class="now-title">Nothing left but the drive home</h3>' +
          '<p class="now-note">Savor the last stretch of two-lane blacktop.</p>');
      }

      var rest = eventsToday(now).filter(function (e) {
        return new Date(e.end).getTime() > now;
      });
      paint(laterList, rest.length
        ? rest.map(function (e) {
            return '<li><span class="l-time">' + e.icon + ' ' + esc(e.time) + '</span>' +
              '<span>' + esc(e.title) + '<br /><small>' + esc(e.place) + '</small></span></li>';
          }).join('')
        : '<li><span>Nothing else on today’s schedule. Stargazing counts as an activity.</span></li>');
      return;
    }

    /* after */
    paint(nowCard,
      '<p class="now-label">Current status</p>' +
      '<span class="now-ico">🌵</span>' +
      '<h3 class="now-title">Trip complete</h3>' +
      '<p class="now-place">Home, hopefully with all of your gear.</p>' +
      '<p class="now-note">Do the unglamorous part now while it is still fresh: rinse the tent, air the sleeping bag, restock the first aid kit.</p>');
    paint(nextCard,
      '<p class="now-label">Next up</p>' +
      '<ul class="later">' +
      '<li><span>📷 Offload and back up the photos before the card disappears</span></li>' +
      '<li><span>📝 Write down the one thing you would do differently next time</span></li>' +
      '<li><span>🌵 Get the next trip on the calendar</span></li>' +
      '</ul>');
    paint(laterList, '<li><span>The itinerary has run its course. Time for the next adventure.</span></li>');
  }

  paintAll();
  setInterval(paintAll, 20000);
}

/* ----------------------------------------------------------------- weather */

function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }

function mean(arr) {
  if (!arr.length) return null;
  return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
}

function wxFetch(url) {
  return fetch(url, { mode: 'cors', cache: 'no-store' }).then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });
}

function forecastUrl(place, from, to) {
  return 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + place.lat + '&longitude=' + place.lon +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code' +
    '&temperature_unit=fahrenheit&precipitation_unit=inch' +
    '&timezone=' + encodeURIComponent(TRIP.timeZone) +
    '&start_date=' + from + '&end_date=' + to;
}

function archiveUrl(place, from, to) {
  return 'https://archive-api.open-meteo.com/v1/archive' +
    '?latitude=' + place.lat + '&longitude=' + place.lon +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
    '&temperature_unit=fahrenheit&precipitation_unit=inch' +
    '&timezone=' + encodeURIComponent(TRIP.timeZone) +
    '&start_date=' + from + '&end_date=' + to;
}

function pickDaily(json, i) {
  var d = json && json.daily;
  if (!d || !d.time || i < 0 || i >= d.time.length) return null;
  return {
    tmax: num(d.temperature_2m_max ? d.temperature_2m_max[i] : null),
    tmin: num(d.temperature_2m_min ? d.temperature_2m_min[i] : null),
    pop: num(d.precipitation_probability_max ? d.precipitation_probability_max[i] : null),
    precip: num(d.precipitation_sum ? d.precipitation_sum[i] : null),
    code: d.weather_code ? d.weather_code[i] : null
  };
}

/* Which of our dates does Open-Meteo's live forecast cover right now? */
function wxSplit(today) {
  var last = addDays(today, WX.horizonDays);
  return {
    live: WX.dates.filter(function (d) { return d >= today && d <= last; }),
    typical: WX.dates.filter(function (d) { return !(d >= today && d <= last); })
  };
}

function fetchLive(split) {
  if (!split.live.length) return Promise.resolve({ dates: [], places: {} });
  var from = split.live[0], to = split.live[split.live.length - 1];

  return Promise.all(WX.places.map(function (place) {
    return wxFetch(forecastUrl(place, from, to)).then(function (json) {
      var out = {};
      split.live.forEach(function (iso) {
        var v = pickDaily(json, json.daily.time.indexOf(iso));
        if (v && v.tmax !== null && v.tmin !== null) { v.source = 'live'; out[iso] = v; }
      });
      return { key: place.key, days: out };
    }).catch(function () { return { key: place.key, days: {} }; });
  })).then(function (results) {
    var places = {};
    results.forEach(function (r) { places[r.key] = r.days; });
    return { dates: split.live, places: places };
  });
}

/* Same calendar dates, 2021–2025, averaged. */
function fetchTypical(split) {
  if (!split.typical.length) return Promise.resolve({ dates: [], places: {} });
  var from = split.typical[0].slice(5), to = split.typical[split.typical.length - 1].slice(5);

  return Promise.all(WX.places.map(function (place) {
    var jobs = WX.years.map(function (year) {
      return wxFetch(archiveUrl(place, year + '-' + from, year + '-' + to))
        .then(function (json) { return { year: year, json: json }; })
        .catch(function () { return null; });
    });

    return Promise.all(jobs).then(function (years) {
      var out = {};
      split.typical.forEach(function (iso) {
        var tail = iso.slice(5);
        var maxes = [], mins = [], precs = [], wet = 0, n = 0;
        years.forEach(function (y) {
          if (!y || !y.json || !y.json.daily || !y.json.daily.time) return;
          var v = pickDaily(y.json, y.json.daily.time.indexOf(y.year + '-' + tail));
          if (!v) return;
          if (v.tmax !== null) maxes.push(v.tmax);
          if (v.tmin !== null) mins.push(v.tmin);
          if (v.precip !== null) { precs.push(v.precip); n++; if (v.precip >= 0.01) wet++; }
        });
        if (!maxes.length && !mins.length) return;
        out[iso] = {
          tmax: mean(maxes), tmin: mean(mins), precip: mean(precs),
          pop: n ? (wet / n) * 100 : 0, wetYears: wet, years: n,
          source: 'typical'
        };
      });
      return { key: place.key, days: out };
    });
  })).then(function (results) {
    var places = {};
    results.forEach(function (r) { places[r.key] = r.days; });
    return { dates: split.typical, places: places };
  });
}

function mergeWeather(live, typical) {
  var places = {};
  WX.places.forEach(function (p) {
    places[p.key] = {};
    var liveDays = live.places[p.key] || {};
    var typDays = typical.places[p.key] || {};
    WX.dates.forEach(function (iso) {
      if (liveDays[iso]) { places[p.key][iso] = liveDays[iso]; }
      else if (typDays[iso]) { places[p.key][iso] = typDays[iso]; }
    });
  });
  return { places: places, liveDates: live.dates, typicalDates: typical.dates };
}

/* -------------------------------------------------------------- wx display */

function initWeather() {
  var body = $('#wx-body');
  var sourceBadge = $('#wx-source');
  var updated = $('#wx-updated');
  var note = $('#wx-note');
  var unitBtn = $('#wx-unit');
  var refreshBtn = $('#wx-refresh');
  if (!body) return;

  var state = {
    data: null,
    metric: store('bb26.weather.unit') === 'C',
    savedAt: 0,
    offline: false,
    loading: false
  };

  function fmtTemp(f) {
    if (f === null || f === undefined || !isFinite(f)) return '–';
    return Math.round(state.metric ? (f - 32) * 5 / 9 : f) + '°';
  }

  function typicalIcon(pop) {
    if (pop >= 60) return '🌧️';
    if (pop >= 40) return '🌦️';
    if (pop >= 20) return '🌤️';
    return '☀️';
  }

  function cellHTML(day) {
    if (!day) return '<td class="wx-cell">no data</td>';
    var isLive = day.source === 'live';
    var ico = isLive ? (WX_ICONS[day.code] || '🌡️') : typicalIcon(day.pop || 0);
    var rain = isLive
      ? '☔ ' + Math.round(day.pop || 0) + '% chance · ' + (day.precip || 0).toFixed(2) + '"'
      : '☔ rain on ' + day.wetYears + ' of ' + day.years + ' yrs';
    return '<td class="wx-cell' + (isLive ? '' : ' is-typical') + '">' +
      '<span class="wx-ico" aria-hidden="true">' + ico + '</span>' +
      '<span class="wx-temps"><b>' + fmtTemp(day.tmax) + '</b> / ' + fmtTemp(day.tmin) + '</span>' +
      '<span class="wx-precip">' + rain + '</span></td>';
  }

  function render() {
    if (!state.data) return;
    body.innerHTML = WX.dates.map(function (iso) {
      var p = dateParts(iso);
      var isTrip = WX.tripDates.indexOf(iso) >= 0;
      var anyLive = WX.places.some(function (pl) {
        var d = state.data.places[pl.key] && state.data.places[pl.key][iso];
        return d && d.source === 'live';
      });
      var badge = '<span class="badge ' + (anyLive ? 'badge--live' : 'badge--typical') + '">' +
        (anyLive ? 'live' : 'typical') + '</span>';
      return '<tr class="' + (isTrip ? 'is-trip' : '') + '">' +
        '<th scope="row" class="wx-day">' +
        '<span class="wx-dow">' + p.dow + '</span>' +
        '<span class="wx-dnum">' + p.mon + ' ' + p.day + '</span>' +
        '<span class="wx-where">' + esc(WX.where[iso] || '') + '</span>' +
        badge +
        '</th>' +
        WX.places.map(function (pl) {
          return cellHTML(state.data.places[pl.key] && state.data.places[pl.key][iso]);
        }).join('') +
        '</tr>';
    }).join('');
  }

  function paintMeta() {
    var split = wxSplit(centralToday());
    var live = split.live.length, typ = split.typical.length;

    if (sourceBadge) {
      sourceBadge.textContent = live === 0 ? '5-year averages' : (typ === 0 ? 'live forecast' : 'live + averages');
      sourceBadge.className = 'badge ' + (live === 0 ? 'badge--typical' : 'badge--live');
    }

    if (updated) {
      if (!state.savedAt) {
        updated.textContent = '';
      } else {
        updated.textContent = 'updated ' +
          new Date(state.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
          ' at ' + clockText(state.savedAt) +
          (state.offline ? ' · offline, showing saved data' : ' · saved on this device');
      }
    }

    if (note) {
      if (live === 0) {
        note.textContent = 'Nov 13–20 is still outside the 16-day forecast window, so these are 5-year averages ' +
          '(2021–2025) for the exact same calendar dates — a solid guide to what the weather usually does. ' +
          'Live forecasts will appear here automatically, day by day, once the trip is about two weeks out.';
      } else if (typ === 0) {
        note.textContent = 'Live forecast from Open-Meteo for the whole stretch — highs, lows and rain odds for each stop.';
      } else {
        note.textContent = 'Mixed mode: ' + live + ' day' + (live === 1 ? '' : 's') + ' of live forecast and ' + typ +
          ' of 5-year averages for the same dates. The averages keep upgrading to live data as departure gets closer.';
      }
    }
  }

  function finish() {
    state.loading = false;
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = '↻ Refresh';
    }
  }

  function load() {
    if (state.loading) return;
    state.loading = true;
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '↻ Checking…';
    }

    var split = wxSplit(centralToday());

    Promise.all([fetchLive(split), fetchTypical(split)])
      .then(function (res) {
        var merged = mergeWeather(res[0], res[1]);
        var covered = WX.places.some(function (p) {
          return Object.keys(merged.places[p.key]).length > 0;
        });
        if (!covered) throw new Error('no weather data');
        state.data = merged;
        state.savedAt = Date.now();
        state.offline = false;
        store(WX.cacheKey, { savedAt: state.savedAt, data: merged });
        render();
        paintMeta();
      })
      .catch(function () {
        state.offline = true;
        if (state.data) {
          render();
          paintMeta();
        } else {
          body.innerHTML = '<tr><td colspan="4" class="wx-error">Could not reach the weather satellite 🛰️ — ' +
            'check the connection and hit Refresh.</td></tr>';
        }
      })
      .then(finish, finish);
  }

  /* Show the last saved snapshot immediately so the table is never empty. */
  var cached = store(WX.cacheKey);
  if (cached && cached.data && cached.data.places) {
    state.data = cached.data;
    state.savedAt = cached.savedAt || 0;
    render();
    paintMeta();
  }

  if (unitBtn) {
    unitBtn.setAttribute('aria-pressed', state.metric ? 'true' : 'false');
    unitBtn.textContent = state.metric ? '°C ↔ °F' : '°F ↔ °C';
    unitBtn.addEventListener('click', function () {
      state.metric = !state.metric;
      store('bb26.weather.unit', state.metric ? 'C' : 'F');
      unitBtn.setAttribute('aria-pressed', state.metric ? 'true' : 'false');
      unitBtn.textContent = state.metric ? '°C ↔ °F' : '°F ↔ °C';
      render();
    });
  }
  if (refreshBtn) refreshBtn.addEventListener('click', load);

  load();
}

/* ----------------------------------------------------------------- packing */

function initPacking() {
  var boxes = $$('input[data-pack]');
  if (!boxes.length) return;

  var meter = $('#pack-meter');
  var count = $('#pack-count');
  var reset = $('#pack-reset');
  var KEY = 'bb26.packing.v1';

  function paint() {
    var done = boxes.filter(function (b) { return b.checked; }).length;
    if (meter) meter.style.width = Math.round((done / boxes.length) * 100) + '%';
    if (count) count.textContent = done + ' of ' + boxes.length;
  }

  function save() {
    store(KEY, boxes.filter(function (b) { return b.checked; })
      .map(function (b) { return b.getAttribute('data-pack'); }));
  }

  var saved = store(KEY);
  if (!Array.isArray(saved)) saved = [];

  boxes.forEach(function (box) {
    if (saved.indexOf(box.getAttribute('data-pack')) >= 0) box.checked = true;
    box.addEventListener('change', function () { paint(); save(); });
  });

  if (reset) {
    reset.addEventListener('click', function () {
      boxes.forEach(function (b) { b.checked = false; });
      store(KEY, null);
      paint();
    });
  }

  paint();
}

/* -------------------------------------------------------------- lightbox --- */

function initLightbox() {
  var box = $('#lightbox');
  var img = $('#lb-img');
  var cap = $('#lb-caption');
  var thumbs = $$('.thumb');
  if (!box || !img || !thumbs.length) return;

  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + thumbs.length) % thumbs.length;
    var source = $('img', thumbs[index]);
    var label = $('span', thumbs[index]);
    if (source) {
      /* thumbnails may point at a lighter copy; the viewer opens the original */
      img.src = source.getAttribute('data-full') || source.getAttribute('src');
      img.alt = source.getAttribute('alt') || '';
    }
    cap.textContent = (label ? label.textContent : '') + '  ·  ' + (index + 1) + ' / ' + thumbs.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.classList.add('is-locked');
    var closeBtn = $('#lb-close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('is-locked');
    img.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () { open(i); });
  });

  var closeBtn = $('#lb-close'), prevBtn = $('#lb-prev'), nextBtn = $('#lb-next');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });

  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowLeft') { show(index - 1); return; }
    if (e.key === 'ArrowRight') { show(index + 1); return; }
    if (e.key === 'Tab') {
      var focusables = $$('.lightbox__btn', box);
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* -------------------------------------------------------------- mobile nav */

function initNav() {
  var nav = $('#site-nav');
  var toggle = $('#nav-toggle');
  var list = $('#nav-list');
  if (!nav || !toggle || !list) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '✕ Close' : '☰ Sections';
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  list.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });

  /* Highlight the section currently in view. */
  var links = $$('a', list);
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (s) { observer.observe(s); });
}

/* -------------------------------------------------------------------- boot */

function boot() {
  var stamp = $('#footer-updated');
  if (stamp) {
    stamp.textContent = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }
  initCountdown();
  initNow();
  initPacking();
  initLightbox();
  initNav();
  initWeather();   /* last: it is the only part that hits the network */
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

