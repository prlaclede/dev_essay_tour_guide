$(document).ready(function() {
    //TODO: incapsulate into INIT function for extendability purposes
    $('[data-toggle="popover"]').popover();
    $('#splash_modal').modal('show');
    $("#svg-icons").load("static/img/icons.svg");
    
    $.getJSON('/loadRecentEssays', function(response) {
       var essayList = response['essayList'];
       $.each(essayList, function() {
            console.log(this);
           $.ajax({
                url: "/recentEssay",
                data: JSON.stringify(this),
                type: "POST",
                contentType: 'application/json',
                dataType: "html",
                success: function(response) {
                    $('.recentEssays').find('ul').append(response);
                },
                error: function (error) {
                    console.log("error" + JSON.stringify(error));
                }
            });
       });
    });

    $.getJSON('/checkUser', function(response) {
        var user = response['user'];
        if (user != null) {
            loadUser(user);
        }
    });
    
    $('.splashLoginButton').on("click", function() {
        console.log('submitting form');
        $.ajax({
            url: '/login',
            data: $(this).closest('#loginForm').serialize(),
            type: 'POST',
            success: function (response) {
                if (response != undefined) {
                    var user = response['user'][0];
                    if (user != undefined) {
                        console.log('valid user');
                        $('.modal-header').after(generateAlert('success', 'Sucessful login!'));
                        $('#splash_modal').modal('hide');
                        $('#popup').modal('hide');
                        loadUser(user);
                    } else {
                        $('.modal-header').after(generateAlert('warning', 'Email and/or Password information is incorrect!'));
                    }
                }
            },
            error: function (error) {
                console.log("error" + error);
            }
        });
    });
    
    $('#splash_modal').on('hide.bs.modal', function () {
        $('#accountActionSpan').show();
        $('#accountActionButton').html('Login');
        $('#welcomeMessage').html('Welcome Guest');
    });
    
    $('#accountActionButton').click(function() {
        var buttonText = $(this).html();
        if (buttonText == 'Login') {
            $('#popup').modal('show').find('.modal-title').html(buttonText);   
        } else if (buttonText == 'Logout') {
            $.getJSON('/logout').done(function (response) {
                console.log(response);
                window.location.reload();
            });
        }
    });
    
    function loadUser (user) {
        $('#accountActionSpan').show();
        $('#accountActionButton').html('Logout');
        $('#welcomeMessage').html("Welcome " + user['first_name'] + " " + user['last_name'])
        if (user['account_type_id_fk'] == 1) {
                $('#welcomeMessage').after(generateSVG('adminAccount', 'accIcon'));
        } else {
                $('#welcomeMessage').after(generateSVG('basicAccount', 'accIcon'));;
        }
    }
    
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