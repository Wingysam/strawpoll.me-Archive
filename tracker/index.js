const express = require('express')
const app = express()

app.use('/api', require('./api')())
app.use('/', express.static('./static'))

app.listen(3030)