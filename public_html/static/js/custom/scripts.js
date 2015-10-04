$(document).ready(function() {
    
    /*socket.on('user_login', function(msg) {
        $('.modal-header').after(generateAlert(msg['messageType'], msg['message']));
    });*/
    $('#splash_modal').modal('show');
    
    $('#splashLoginButton').on("click", function() {
        console.log('submitting form');
        $.ajax({
            url: '/login',
            data: $('#loginForm').serialize(),
            type: 'POST',
            success: function (response) {
                if (JSON.parse(response)['valid'] == 'true') {
                    console.log('valid user');
                    $('.modal-header').after(generateAlert('success', 'Sucessful login!'));
                } else {
                    $('.modal-header').after(generateAlert('warning', 'Email and/or Password information is incorrect!'));
                }
            },
            error: function (error) {
                console.log("error" + error);
            }
        })
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
    $('.alert').remove();
    var alert = '<div class="alert alert-' + type + '"> \
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> \
                ' + message + '</div>'
        return alert;
    }
});