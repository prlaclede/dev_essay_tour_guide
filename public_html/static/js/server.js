/* global io */

$(document).ready(function() {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port);
    
    socket.on('user_login', function(msg) {
        generateAlert(msg['messageType'], msg['message']);
    });
    
    $('#submit_login').on("click", function() {
        console.log('something happened');
        socket.emit('login_event', {email: $('#log_email').val(), pass: $('#log_pass').val()});
        return false;
    });
    
    $('#register-modal').submit(function(event) {
        socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
        return false;
    });
    
    $("#svg-icons").load("static/img/icons.svg");
    
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
      var alert = "<div class='alert alert-{0}'> \
                    {1} \
                  </div>".format(type, message);
      return alert;
    }
});