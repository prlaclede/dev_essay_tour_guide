$(function (accLogic, $, undefined) {

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
    
/* ---------- jQuery listeners ---------- */
    
    $('body')
    
        .on('click', '.loginButton', function() {
            var thisForm = $(this).closest('#loginForm');
            if (!accLogic.isValidEmailAddress(thisForm.find('.emailField').val())) {
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
        
        .on('change', '.adminCheckbox', function() {
            $('.adminCode').toggleClass('hidden');
        })
    
        .on('click', '.registerButton', function() {
            var thisForm = $(this).closest('#registerForm');
            if (!accLogic.isValidEmailAddress(thisForm.find('.emailField').val())) {
                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/register',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response['error']) {
                            console.log(response);
                            if (response['error'] == 'errorCode') {
                                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'Invalid Admin Code!'));
                            } else {
                                thisForm.closest('.modal-body').before(etgLogic.generateAlert('warning', 'That email has already been registered!'));
                            }
                            
                        } else {
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
            var buttonText = $(this).html();
            if (buttonText == 'Login') {
                $.ajax({
                    url: '/getLoginForm',
                    type: "POST",
                    contentType: 'application/json',
                    dataType: "html",
                    success: function(response) {
                        //clear old form, append newly ajax'd form
                        $('#accountActionPopup').find('.alert').remove();
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
                    $('#accountActionPopup').find('.alert').remove();
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
                thisForm.closest('.modal-body').before(etgLogic.generateAlert("warning", "The passwords entered don't match!"));
            }
        })
        
        .on('click', '.submitPasswordReset', function() {
            var thisForm = $(this).closest('#forgotPasswordForm');
            if (accLogic.isValidEmailAddress(thisForm.find('.emailField').val())) {
                $.ajax({
                    url: '/sendResetEmail',
                    type: 'POST',
                    data: thisForm.serialize(),
                    success: function(response) {
                        console.log(response['error']);
                        if (response['error']) {
                            $('#forgotPasswordForm').before(etgLogic.generateAlert("warning", "The email address you entered is not currently registered!"));
                        } else {
                            $('#forgotPasswordForm').before(etgLogic.generateAlert("info", "You will recieve an email with a link to reset your password!"));      
                        }
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
               });
           } else {
               $('#forgotPasswordForm').before(etgLogic.generateAlert("warning", "Please enter an email address"));
           }
        });
        
/* ---------- end jQuery listeners ---------- */  
    
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
        }).done(function() {
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
        });
    }
    
    accLogic.generateProgressBar = function (element) {
        $.ajax({
            url: '/generateProgressBar',
            type: "POST",
            dataType: "html",
            success: function(response) {
                element.find('.submitEssay').remove();
                element.append(response);
            },
            error: function (error) {
                return("error" + JSON.stringify(error));
            }
        });
    }
    
    accLogic.isValidEmailAddress = function (emailAddress) {
        /* from the regex library at https://regex101.com/ */
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return pattern.test(emailAddress);
    }
    
}( window.accLogic = window.accLogic || {}, jQuery ));