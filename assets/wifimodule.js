var socket = io();

socket.on('haji-bd', () => {

    lightsOn()
})

function lightsOn() {

    $('#container').css('background-color', getRandomColor());      
}