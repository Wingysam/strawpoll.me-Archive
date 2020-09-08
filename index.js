const { appendFile } = require('fs').promises
const fetch = require('node-fetch')

async function main() {
  let i = 0
  while (i < 4) {
    i++
    get(i)
  }
}

async function get(i) {
  const json = await fetch(`https://strawpoll.me/api/v2/polls/${i}`).then(res=>res.text())
  await appendFile('logs.json', '\n' + json)
  console.log(i)
}

main()