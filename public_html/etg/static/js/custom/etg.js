$(document).ready(function() {
    //TODO: incapsulate into INIT function for extendability purposes
    $('[data-toggle="popover"]').popover();
    $('#splash_modal').modal('show');
    $("#svg-icons").load("static/img/icons.svg");

    $.getJSON('/checkUser').done(function(response) {
        if (response != undefined) {
            console.log(response);
        }
    });
    
    $('#splash_modal').on('hide.bs.modal', function () {
        $('#accountActionButton').html('Login').show();
    });
    
    $('#splashLoginButton').on("click", function() {
        console.log('submitting form');
        $.ajax({
            url: '/login',
            data: $('#loginForm').serialize(),
            type: 'POST',
            success: function (response) {
                if (response != undefined) {
                    var user = response['user'][0]
                    console.log('valid user');
                    $('.modal-header').after(generateAlert('success', 'Sucessful login!'));
                    $('#splash_modal').modal('hide');
                    if (user['accType'] == 1) {
                        $('#accountActionButton').html('Logout').show();
                        $('#welcomeMessage')/*.html("Welcome " + user['first_name'] + " " + user['last_name'])*/
                            .after(generateSVG('adminAccount', 'accIcon'));
                    } else {
                        $('#accountActionButton').html('Logout').show();
                        $('#welcomeMessage')/*.html("Welcome " + user['first_name'] + " " + user['last_name'])*/
                            .after(generateSVG('basicAccount', 'accIcon'));;
                    }
                } else {
                    $('.modal-header').after(generateAlert('warning', 'Email and/or Password information is incorrect!'));
                }
            },
            error: function (error) {
                console.log("error" + error);
            }
        });
    });
    
    $('#accountActionButton').click(function() {
        var title = $(this).html();
       $('#popup').modal('show').find('.modal-title').html(title);
    });
    
    function generateSVG(icon, addClass) {
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