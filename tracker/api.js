const { statSync, writeFileSync, readFileSync } = require('fs')
const { stat, readFile } = require('fs').promises
const express = require('express')
const WebSocket = require('ws')

// Using everything sync is a hack to avoid giving out the same block twice

module.exports = () => {
  const router = express.Router({ mergeParams: true })

  const wss = new WebSocket.Server({ port: 3031 })

  router.get('/job', async (req, res) => {
    let i = 0
    while (true) {
      try { await statSync(`blocks/${i}`) } catch {
        if (i > 20800) return res.json(false)
        await writeFileSync(`blocks/${i}`, '')
        updateStats(wss)
        return res.json(i)
      }
      i++
    }
  })
  router.post('/job/:i', express.raw({ limit: '10mb', type: '*/*'}), async (req, res) => {
    try {
      Number(req.params.i)
    } catch { return res.json(false) }
    try {
      if ((await readFileSync(`blocks/${req.params.i}`)).toString() !== '') return res.json(false)
    } catch {}

    await writeFileSync(`blocks/${req.params.i}`, req.body.toString())
    console.log(`Job ${req.params.i} done`)
    updateStats(wss)
    return res.json(true)
  })

  return router
}

async function updateStats(wss) {
  let i = 0
  let out = 0
  let done = 0
  let todo = 0
  try {
    while (i < 20000) {
      try {
        const file = (await readFile(`blocks/${i}`)).toString()
        if (file === '') out++
        if (file !== '') done++
      } catch { todo++ }
      i++
    }
    wss.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) return
      client.send(JSON.stringify({ out, done, todo }))
    })
  } catch (error) {
    console.error(error)
  }
}
