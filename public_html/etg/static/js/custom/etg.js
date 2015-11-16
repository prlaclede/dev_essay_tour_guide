//$(document).ready(function() {
$(function (etgLogic, $, undefined) {
    //TODO: incapsulate into INIT function for extendability purposes
    $('[data-toggle="popover"]').popover();
    $('#splash_modal').modal('show');
    $("#svg-icons").load("/static/img/icons.svg");
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
                    $('.recentEssays_list').append(response);
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
                        console.log("error" + JSON.stringify(error));
                    }
                });
            }
        })
    
        .on('click', '.registerButton', function() {
            var thisForm = $(this).closest('#registerForm');
            if (!isValidEmailAddress(thisForm.find('.emailField').val())) {
                $('.modal-header').after(generateAlert('warning', 'Invalid Email!'));
            } else {
                $.ajax({
                    url: '/register',
                    data: thisForm.serialize(),
                    type: 'POST',
                    success: function (response) {
                        if (response != undefined) {
                            var emailParams = response['emailParams'];
                            $('.modal-header').after(generateAlert('success', 'You will recieve an email when your account has been approved.'));
                            /*$.ajax({
                               url: '/sendMail',
                               data: emailParams,
                               type: 'POST',
                               success: function (response) {
                                   $('.modal-header').after(generateAlert('success', 'You will recieve an email when your account has been approved.')); 
                               },
                               error: function (error) {
                                   console.log("error" + JSON.stringify(error));
                               }
                            });*/
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
    
        .on('click', '.mapMode', function() {
            $('.mapMode').closest('li').removeClass('selectedMode');
            $(this).closest('li').toggleClass('selectedMode'); 
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
        
        .on('click', '.approveButton', function() {
            var row = $(this).closest('tr');
            var tableType = row.attr('class');
            console.log(tableType);
            if (tableType === 'pendingUser') {
                var emailForm = new FormData();
                emailForm.append('email', row.find('.email').html());
                emailForm.append('first', row.find('.first').html());
                emailForm.append('last', row.find('.last').html());
                $.ajax({
                    url: '/sendMail',
                    data: emailForm,
                    type: 'POST',
                    processData: false,
                    contentType: false
                });
            } else if (tableType === 'pendingEssay') {
                $.getJSON('/approveEssay').done(function (response) {

                });
            }
        })
    
        .on('click', '.denyButton', function() {
            var tableType = $(this).closest('tr').attr('class');
            console.log(tableType);
            if (tableType === 'pendingUser') {
                $.getJSON('/denyUser').done(function (response) {

                });
            } else if (tableType === 'pendingEssay') {
                $.getJSON('/denyEssay').done(function (response) {

                });
            }
        })
        
        .on('click', '.submitEssay', function() {
            var thisPopup = $(this).closest('.essayUploadLink');
            console.log('starting drive post');
            var marker = $(this).closest('.essayUploadLink');
            var fileForm = new FormData($('#newFileForm')[0]);
            fileForm.append('lat', marker.attr('lat'));
            fileForm.append('long', marker.attr('long'));
            $.ajax({
                url: '/fileUpload',
                type: 'POST',
                data: fileForm,
                processData: false,
                contentType: false,
            }).done(function(response) {
                var meta = response['meta'];
                mapsLogic.geocodeLatLng(meta['lat'], meta['long']);
                var markAddr = mapsLogic.returnMarkAddr();
                response['meta']['addr'] = markAddr
                $.ajax({
                    url: '/newMarker', 
                    type: 'POST', 
                    data: response['meta']
                }).done(function (response) {
                    var meta = response['meta']
                    $.ajax({
                        url: '/newEssay',
                        type: 'POST', 
                        data: meta
                    }).done(function(response) {
                        var meta = response['meta'];
                        swapUploadToPopup(thisPopup, meta);
                    });
                });
            });
        })
        
        .on('click', '.closeTab', function () {
            var $this = $(this);
            var previousTab = $this.closest('li').prev();
            var prevContent = previousTab.find('a').attr('href');
            previousTab.addClass('active');
            $(prevContent).addClass('active in');
            var tabId = $this.closest('a').attr('href');
            $(tabId).remove();
            $this.closest('li').remove();
        });
    
    function loadUser (user) {
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
    
    etgLogic.generateSVG = function(icon, addClass) {
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
        var entry = '<tr class="pendingUser"> \
                        <td class="first">' + user['first_name'] + '</td> \
                        <td class="last">' + user['last_name'] + '</td> \
                        <td class="email">' + user['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm approveButton">' + etgLogic.generateSVG('check') + '</button></td>\
                        <td><button type="button" class="btn btn-sm denyButton">' + etgLogic.generateSVG('close') + '</button></td>\
                    </tr>';
        return entry;
    }
    
    function generatePendingEssay(essay) {
        var entry = '<tr class="pendingEssay"> \
                        <td class="title">' + essay['title'] + '</td> \
                        <td class="address">' + essay['marker'][0]['address'] + '</td> \
                        <td class="email">' + essay['user'][0]['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm approveButton">' + etgLogic.generateSVG('check') + '</button></td>\
                        <td><button type="button" class="btn btn-sm denyButton">' + etgLogic.generateSVG('close') + '</button></td>\
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
        return header;
    }
    
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return pattern.test(emailAddress);
    }
    
    function swapUploadToPopup(element, content) {
        element.html("<div class='mapEssayLink'> \
            <h6 class='essayLinkTitle'>" + content['essayTitle'] + "</h6> \
            <a href='" + content['docLink'] + "' type='button' class='eassayLinkButton btn btn-sm btn-info' target='_blank'>View</a> \
        </div>");
    }
    
}( window.etgLogic = window.etgLogic || {}, jQuery ));