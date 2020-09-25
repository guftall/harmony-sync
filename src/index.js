const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve('view/index.html'))
})
app.get('/robot', (req, res) => {
    res.sendFile(path.resolve('view/robot-dance.html'))
})
app.get('/rythm', (req, res) => {
    res.sendFile(path.resolve('view/rythm.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
