var mqtt = require('mqtt')

let brokerAddress = process.env.MQTT_BROKER || 'mqtt://f.r9k.ir'
var client = mqtt.connect(brokerAddress)

let hajiTopic = 'haji_bd'
client.on('connect', function () {
    console.log('connected to ', brokerAddress)
    client.subscribe(hajiTopic, function (err) {
        if (err) {
            console.error('subscribe to ' + hajiTopic)
        }
    })
    client.subscribe('ping', err => {

        if (err) {
            console.error('subscribe to ping')
        }
    })
})

client.on('error', err => {
    console.error(err)
})

client.on('message', function (topic, message) {
    // message is Buffer
    if (topic == hajiTopic) {
        let msg = message.toString()
        if (Number(msg) == 1) {
            lightsOn()
        }
    }
    console.log(topic, message.toString())
})

var lightsOnListener;
exports.setLightsOnListener = function setLightsOnListener(cb) {
    lightsOnListener = cb
}

function lightsOn() {

    console.log('LIGHTS ON')
    if (lightsOnListener != undefined && typeof lightsOnListener == 'function') {
        lightsOnListener()
    }
}