const express = require('express')
const path = require('path')
var http = require('http')
const { initializeSocketio } = require('./socketioHandler')
const { setLightsOnListener } = require('./mqttHandler')
const { startDance, onClientConnected } = require('./harmonyGenerator')
const app = express()
const port = 3050

app.use('/assets', express.static('assets'))

app.get('/mqtt', (req, res) => {
    res.sendFile(path.resolve('view/mqtt.html'))
})
app.get('/wifimodule', (req, res) => {
    res.sendFile(path.resolve('view/wifimodule.html'))
})
app.get('/robot', (req, res) => {
    res.sendFile(path.resolve('view/robot-dance.html'))
})
app.get('/rythm', (req, res) => {
    res.sendFile(path.resolve('view/rythm.html'))
})
app.get('/', (req, res) => {
    res.sendFile(path.resolve('view/haji.html'))
})
app.get('/admin-ad982374ur', (req, res) => {
    res.sendFile(path.resolve('view/admin.html'))
})

var httpServer = http.createServer(app)

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const socketIo = initializeSocketio(httpServer, onClientConnected)

setLightsOnListener(startDance(socketIo))
