$(document).ready(function() {
    //TODO: incapsulate into INIT function for extendability purposes
    $('[data-toggle="popover"]').popover();
    $('#splash_modal').modal('show');
    $("#svg-icons").load("static/img/icons.svg");
    $(document).keypress(function(e){
        if (e.which == 13){
            $(".splashLoginButton").click();
        }
    });
    
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
        $('#accountRegisterButton').show();
        $('#welcomeMessage').html('Welcome Guest');
    });
    
    $('.mapMode').on('click', function() {
        $('.mapMode').closest('li').removeClass('selectedMode');
        $(this).closest('li').toggleClass('selectedMode'); 
    });
    
    $('#accountActionButton').on('click', function() {
        console.log('account action pressed');
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
    
    $('#accountRegisterButton').on('click', function () {
       console.log('register clicked'); 
    });
    
    $('body').on('click', '.submitEssay', function() {
     console.log('starting drive post');
     var file = $('#newFile')[0].files;
     var fileForm = new FormData($('#newFileForm')[0]);
     console.log(fileForm);
     //file = convertToBuf(file);
     //console.log(file);
     $.ajax({
         url: '/fileUpload',
         type: 'POST',
         data: fileForm,
         processData: false,
         contentType: false,
     });
    });
    
    function loadUser (user) {
        $('#accountActionSpan').show();
        $('#accountRegisterButton').hide();
        $('#accountActionButton').html('Logout');
        $('#welcomeMessage').html("Welcome " + user['first_name'] + " " + user['last_name'])
        if (user['account_type_id_fk'] == 1) {
            $('#accountActionSpan').find('div.im').remove();
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
    
    function convertToBuf(file) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
      
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        console.log(reader);
        reader.onload = function(e) {
        var contentType = file.type || 'application/octet-stream';
        var metadata = {
          'title': file.fileName,
          'mimeType': contentType
        };
    
        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;
            return multipartRequestBody;
        }
    }     
});