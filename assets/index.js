var colors = ['red', 'blue', 'green', '#111222']
var i = 0

let brokerAddress = 'mqtt://localhost:9001'
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

function lightsOn() {

    $('#container').css('background-color', colors[(i++) % colors.length]);      
}