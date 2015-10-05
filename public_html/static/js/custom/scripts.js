$(document).ready(function() {
    
    //TODO: incapsulate into INIT function for extendability purposes
    $('#splash_modal').modal('show');
    $("#svg-icons").load("static/img/icons.svg");
    
    $('div.im').each(function() {
        $(this).load($(this));
    });
    
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
                    $('#splash_modal').modal('hide');
                    $('#accountActionButton').show();
                } else {
                    $('.modal-header').after(generateAlert('warning', 'Email and/or Password information is incorrect!'));
                }
            },
            error: function (error) {
                console.log("error" + error);
            }
        })
    });
    
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