$(function (accLogic, $, undefined) {
    //TODO: incapsulate into INIT function for extendability purposes
    $(document).keypress(function(e){
        if (e.which == 13){
            $(".splashLoginButton").click();
        }
    });

    $.getJSON('/checkUser', function(response) {
        var user = response['user'];
        if (user != null) {
            accLogic.loadUser(user);
        }
    });
    
    $('body')
    
        .on('click', '.loginButton', function() {
            var thisForm = $(this).closest('#loginForm');
            if (!isValidEmailAddress(thisForm.find('.emailField').val())) {
                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/login',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response != undefined) {
                            var user = response['user'][0];
                            if (user != undefined) {
                                thisForm.closest('.modal-body').before(etgLogic.generateAlert('success', 'Sucessful login!'));
                                $('#splash_modal').modal('hide');
                                $('#accountActionPopup').modal('hide');
                                accLogic.loadUser(user);
                            } else {
                                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'Email and/or Password information is incorrect!'));
                            }
                        }
                    },
                    error: function (error) {
                        console.log("error" + JSON.stringify(error));
                    }
                });
            }
        })
    
        .on('click', '.registerButton', function() {
            var thisForm = $(this).closest('#registerForm');
            if (!isValidEmailAddress(thisForm.find('.emailField').val())) {
                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/register',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response['error']) {
                            var emailParams = response['emailParams'];
                            thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'That email has already been registered!'));
                        } else {
                            var emailParams = response['emailParams'];
                            thisForm.closest('.modal-body').before(etgLogic.generateAlert('success', 'You will recieve an email when your account has been approved.'));
                        }
                    },
                    error: function (error) {
                        console.log("error" + JSON.stringify(error));
                    }
                });
            }
        })
    
        .on('hide.bs.modal', '#splash_modal', function () {
            $('.alert').remove();
            $('#accountActionSpan').show();
            $('#accountActionButton').html('Login');
            $('#accountRegisterButton').show();
            $('#welcomeMessage').html('Welcome Guest');
        })
        
        .on('click', '#accountActionButton', function() {
            console.log('checking this');
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
        
        .on('click', '#accountRegisterButton', function() {
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
        
        .on('click', '.setPasswordButton', function() {
            var thisForm = $(this).closest('#setPasswordForm');
            var pass1Val = thisForm.find('#password').val();
            var pass2Val = thisForm.find('#passwordVerify').val();
            if (pass1Val == pass2Val) {
                $.ajax({
                    url: '/setPassword',
                    type: 'POST',
                    data: thisForm.serialize(),
                    dataType: "html",
                    success: function(response) {
                        window.location = response; 
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            } else {
                thisForm.closest('.modal-body').before(etgLogic.generateAlert("warning", "The passwords don't match!"));
            }
        })
    
    accLogic.loadUser = function (user) {
        $('#accountActionSpan').show();
        $('#accountRegisterButton').hide();
        $('#accountActionButton').html('Logout');
        $('#welcomeMessage').html("Welcome " + user['first_name'] + " " + user['last_name'])
        $('#accountActionSpan').find('div.im').remove();
        $.ajax({
            url: '/getUserTools',
            type: "POST",
            contentType: 'application/json',
            dataType: "html",
            success: function(response) {
                //add map edit tools
                $('.featuresNav').append(response);
            },
            error: function (error) {
                return("error" + JSON.stringify(error));
            }
        });
        if (user['account_type_id_fk'] == 1) {
            $.ajax({
                url: '/getAdminTools',
                type: "POST",
                contentType: 'application/json',
                dataType: "html",
                success: function(response) {
                    //add admin dropdown tools
                    $('.featuresNav').append(response);
                },
                error: function (error) {
                    return("error" + JSON.stringify(error));
                }
            });
            $('#welcomeMessage').after(etgLogic.generateSVG('adminAccount', 'accIcon'));
        } else {
            $('#welcomeMessage').after(etgLogic.generateSVG('basicAccount', 'accIcon'));;
        }
    }
    
    accLogic.isValidEmailAddress = function (emailAddress) {
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return pattern.test(emailAddress);
    }
    
}( window.accLogic = window.accLogic || {}, jQuery ));