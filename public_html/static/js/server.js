/* global io */

$(document).ready(function() {
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/test');
    socket.on('user_login', function(msg) {
        $('#log').append('<p>Received: ' + msg.data + '</p>');
    });
    $('#submit_login').on("click", function() {
        console.log('something happened');
        socket.emit('login_event', {data: "user info"});
        return false;
    });
    $('#register-modal').submit(function(event) {
        socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
        return false;
    });
});