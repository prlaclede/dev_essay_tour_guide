/* global io */

$(document).ready(function() {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port);
    
    socket.on('user_login', function(msg) {
        $('.modal-header').after(generateAlert(msg['messageType'], msg['message']));
    });
    
    $('#splashLoginButton').on("click", function() {
        console.log('something happened');
        socket.emit('login_event', {email: $('#log_email').val(), pass: $('#log_pass').val()});
        return false;
    });
    
    $("#svg-icons").load("static/img/icons.svg");
    
    $('#splash_modal').modal('show');
    
    function loadSvg(icon, addClass) {
      var image = "<div class='im " + addClass + "'> \
                    <svg viewBox='0 0 34 34'> \
                      <g> \
                        <use xlink:href='#" + icon + "'></use> \
                      </g> \
                    </svg> \
                  </div>";
      return image;
    }
    
    function generateAlert(type, message) {
    $('.alert').remove();
    var alert = '<div class="alert alert-' + type + '"> \
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> \
                ' + message + '</div>'
        return alert;
    }
});