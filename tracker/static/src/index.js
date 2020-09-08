const BLOCK_AMOUNT = 1000
const API_URL = 'https://saw.home.wingysam.xyz/api'

const browser = typeof document !== 'undefined'
if (typeof require !== 'undefined') { fetch = require('node-fetch') }

let concurrent = 1
try { concurrent = process.env.CONCURRENT || 1} catch {}
try { concurrent = Number(location.search.replace('?', '') || 1) } catch {}

console.log(`Using ${concurrent} concurrent item(s)` + '\n' + '-'.repeat(`Using ${concurrent} concurrent item(s)`.length))
if (browser) document.querySelector('#threadcount').textContent = concurrent

if ((concurrent > 20 && browser) || (concurrent > 30 && !browser)) {
  console.warn(`WARNING! Using ${concurrent} concurrent. This may cause the JavaScript process to run slowly!\nContinuing anyway.`)
}

async function main() {
  if (browser) {
    const progress = document.createElement('progress')
    progress.classList.add('is-block', 'progress')
    progress.max = BLOCK_AMOUNT
    progress.value = 0
    document.querySelector('#threads').appendChild(progress)
    while (true) {
      const block = await getBlock(progress)
      if (block === false) {
        concurrent--
        document.querySelector('#threadcount').textContent = concurrent
        progress.parentNode.removeChild(progress)
        return
      }
    }
  } else {
    while (true) {
      await getBlock()
    }
  }
}

async function getBlock(progress) {
  const block = await fetch(`${API_URL}/job`).then(res => res.json())
  if (block === false) return false
  const blockStart = block * BLOCK_AMOUNT
  const blockEnd = blockStart + BLOCK_AMOUNT

  const data = []
  let j = 0
  for (let i = blockStart; i < blockEnd; i++) {
    j++
    try {
      const poll = (await (await fetch(`https://www.strawpoll.me/api/v2/polls/${i}`)).text())
      if (!poll) {
        console.warn(`Block #${block} item #${i} returned blank`)
      }
      data.push(poll)
    } catch {
      console.error(`Skipping poll id ${i}`)
    }
    if (progress) progress.value = j
  }
  const worked = await fetch(`${API_URL}/job/${block}`, {
    method: 'post',
    body: data.join('\n')
  }).then(res => res.json())

  if (!worked) return console.error(`Block #${block} failed, maybe someone else confirmed it`)

  if (browser) {
    const completed = document.querySelector('#completed')
    completed.textContent = Number(completed.textContent) + 1
  }

  console.log(`Completed block ${block}`)

  return true
}

for (let i = 0; i < concurrent; i++) {
  main()
}

if (browser) {
  const socket = new WebSocket('wss://saw.home.wingysam.xyz/stats')
  socket.onmessage = message => {
    try {
      const { out, done, todo } = JSON.parse(message.data)
      if (!out || !done || !todo) return console.log('missing stats')
      document.querySelector('#out').textContent = out
      document.querySelector('#done').textContent = done
      document.querySelector('#todo').textContent = todo
    } catch (error) { console.error(error) }
  }
}
