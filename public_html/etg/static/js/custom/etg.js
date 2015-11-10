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
    
    $('body')
    
        .on('click', '.loginButton', function() {
            var thisForm = $(this).closest('#loginForm');
            if (!isValidEmailAddress(thisForm.find('.emailField').val())) {
                $('.modal-header').after(generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/login',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response != undefined) {
                            var user = response['user'][0];
                            if (user != undefined) {
                                $('.modal-header').after(generateAlert('success', 'Sucessful login!'));
                                $('#splash_modal').modal('hide');
                                $('#accountActionPopup').modal('hide');
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
            }
        })
    
        .on('click', '.registerButton', function() {
            var thisForm = $(this).closest('#registerForm');
            console.log(thisForm.find('.emailField').val());
            if (!isValidEmailAddress(thisForm.find('.emailField').val())) {
                $('.modal-header').after(generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/register',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response != undefined) {
                            var user = response['user'][0];
                            if (user != undefined) {
                               $('.modal-header').after(generateAlert('success', 'You will recieve an email when your account has been approved.')); 
                            } else {
                                $('.modal-header').after(generateAlert('warning', 'Email and/or Password information is incorrect!'));
                            }
                        }
                    },
                    error: function (error) {
                        console.log("error" + error);
                    }
                });
            }
        })
    
        .on('hide.bs.modal', function () {
            $('.alert').remove();
            $('#accountActionSpan').show();
            $('#accountActionButton').html('Login');
            $('#accountRegisterButton').show();
            $('#welcomeMessage').html('Welcome Guest');
        })
    
        .on('click', '.mapMode', function() {
            $('.mapMode').closest('li').removeClass('selectedMode');
            $(this).closest('li').toggleClass('selectedMode'); 
        })
        
        .on('click', '#accountActionButton', function() {
           var buttonText = $(this).html();
            if (buttonText == 'Login') {
                $.ajax({
                    url: '/getLoginForm',
                    type: "POST",
                    contentType: 'application/json',
                    dataType: "html",
                    success: function(response) {
                        //clear old form, append newly ajax'd form
                        $('#accountActionPopup').find('.modal-body').html('').append(response);
                        $('#accountActionPopup').modal('show').find('.modal-title').html('Login');  
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            } else if (buttonText == 'Logout') {
                $.getJSON('/logout').done(function (response) {
                    window.location.reload();
                });
            } 
        })
        
        .on('click', '#accountRegisterButton', function () {
           console.log('register clicked');
            $.ajax({
                url: '/getRegisterForm',
                type: "POST",
                contentType: 'application/json',
                dataType: "html",
                success: function(response) {
                    //clear old form, append newly ajax'd form
                    $('#accountActionPopup').find('.modal-body').html('').append(response);
                    $('#accountActionPopup').modal('show').find('.modal-title').html('Register');
                },
                error: function (error) {
                    return("error" + JSON.stringify(error));
                }
            });
        })
    
        .on('click', '#pendingUsers', function() {
            $.getJSON('/pendingUsers').done(function (response) { 
               var users = response['users'];
               $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
               $('.pendingTableHead').append(generateTableHeader('users'));
               $.each(users, function() {
                   $('.pendingTableBody').append(generatePendingUser(this));
               });
            });
            $('#pendingPopup').modal('show').find('.modal-title').html($(this).text());   
        })
    
        .on('click', '#pendingEssays', function() {
           $.getJSON('/pendingEssays').done(function (response) {
              var essays = response['essays'];
              $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
              $('.pendingTableHead').append(generateTableHeader('essays'));
              $.each(essays, function() {
                  $('.pendingTableBody').append(generatePendingEssay(this));
              });
           });
           $('#pendingPopup').modal('show').find('.modal-title').html($(this).text());   
        })
    
        .on('click', '.submitEssay', function() {
            console.log('starting drive post');
            var fileForm = new FormData($('#newFileForm')[0]);
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
    
    function generatePendingUser(user) {
        var entry = '<tr> \
                        <td>' + user['first_name'] + '</td> \
                        <td>' + user['last_name'] + '</td> \
                        <td>' + user['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm">' + generateSVG('check', 'pendingApproveIcon') + '</button></td>\
                        <td><button type="button" class="btn btn-sm">' + generateSVG('close', 'pendingDenyIcon') + '</button></td>\
                    </tr>';
        return entry;
    }
    
    function generatePendingEssay(essay) {
        var entry = '<tr> \
                        <td>' + essay['title'] + '</td> \
                        <td>' + essay['marker'][0]['address'] + '</td> \
                        <td>' + essay['user'][0]['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm">' + generateSVG('check', 'pendingApproveIcon') + '</button></td>\
                        <td><button type="button" class="btn btn-sm">' + generateSVG('close', 'pendingDenyIcon') + '</button></td>\
                    </tr>';
        return entry;
    }
    
    function generateTableHeader(type) {
        var header = '<tr> \
                        <th>' + ((type === 'users') ? 'Firstname' : 'Title') + '</th> \
                        <th>' + ((type === 'users') ? 'Lastname' : 'Marker Address') + '</th> \
                        <th>' + ((type === 'users') ? 'Email' : 'User Email') + '</th> \
                        <th>Approve</th> \
                        <th>Deny</th> \
                     </tr>'
        console.log(header);
        return header;
    }
    
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return pattern.test(emailAddress);
    }
    
});