$(function (etgLogic, $, undefined) {
    //TODO: incapsulate into INIT function for extendability purposes
    $('[data-toggle="popover"]').popover();
    $('#splash_modal').modal('show');
    $("#svg-icons").load("/static/img/icons.svg");
    
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

    $('body')
    
        .on('click', '.mapMode', function() {
            $('.mapMode').closest('li').removeClass('selectedMode');
            $(this).closest('li').toggleClass('selectedMode'); 
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
            if (tableType === 'pendingUser') {
                var userForm = new FormData();
                userForm.append('userId', row.find('#userId').val());
                userForm.append('email', row.find('.email').html());
                userForm.append('first', row.find('.first').html());
                userForm.append('last', row.find('.last').html());
                $.ajax({
                    url: '/sendMail',
                    data: userForm,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        row.remove()
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            } else if (tableType === 'pendingEssay') {
                var essayForm = new FormData();
                essayForm.append('essayId', row.find("input[name='essayId']").val());
                essayForm.append('markerId', row.find("input[name='markerId']").val());
                $.ajax({
                    url: '/approveEssay',
                    data: essayForm,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        row.remove()
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            }
        })
    
        .on('click', '.denyButton', function() {
            var row = $(this).closest('tr');
            var tableType = row.attr('class');
            if (tableType === 'pendingUser') {
                var userForm = new FormData();
                userForm.append('userId', row.find("input[name='userId']").val());
                userForm.append('email', row.find('.email').html());
                userForm.append('first', row.find('.first').html());
                userForm.append('last', row.find('.last').html());
                $.ajax({
                    url: '/denyUser',
                    data: userForm, 
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        row.remove()
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            } else if (tableType === 'pendingEssay') {
            var essayForm = new FormData();
                essayForm.append('essayId', row.find("input[name='essayId']").val());
                essayForm.append('markerId', row.find("input[name='markerId']").val());
                $.ajax({
                    url: '/denyEssay',
                    data: essayForm,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        row.remove()
                    },
                    error: function (error) {
                        return("error" + JSON.stringify(error));
                    }
                });
            }
        })
        
        .on('click', '.submitEssay', function() {
            var thisPopup = $(this).closest('.essayUploadLink');
            console.log('starting drive post');
            var fileForm = new FormData($('#newFileForm')[0]);
            console.log(thisPopup.attr('lat'));
            fileForm.append('lat', thisPopup.attr('lat'));
            fileForm.append('lng', thisPopup.attr('lng'));
            $.ajax({
                url: '/fileUpload',
                type: 'POST',
                data: fileForm,
                processData: false,
                contentType: false,
            }).done(function(response) {
                var meta = response['meta'];
                mapsLogic.geocodeLatLng(meta['lat'], meta['lng']);
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
        })
        
        .on('click', '.pendingLocation', function() {
            var row = $(this).closest('.pendingEssay');
            var thisLat = row.find("input[name='markerLat']").val();
            var thisLng = row.find("input[name='markerLng']").val()
            $(this).addClass('animated flipInX').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('animated flipInX');
            });
            var mapProp = {
                center: new google.maps.LatLng(thisLat, thisLng),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $('.markerLocation').popover('show');
            var popoverId = $('.markerLocation').attr('aria-describedby');
            var popoverContent = $('#' + popoverId).find('.popover-content').addClass('popoverMap');
            var popoverMap = new google.maps.Map(popoverContent[0], mapProp);
            new google.maps.Marker ({
              position: new google.maps.LatLng(thisLat, thisLng),
              animation: google.maps.Animation.DROP,
            }).setMap(popoverMap);
        });
    
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
    
    etgLogic.generateAlert = function (type, message) {
    $('.alert').remove();
    var alert = '<div class="alert alert-' + type + '"> \
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> \
                ' + message + '</div>'
        return alert;
    }
    
    function generatePendingUser(user) {
        var entry = '<tr class="pendingUser"> \
                        <input type="hidden" name="userId" value="' + user['id'] + '"> \
                        <td class="first">' + user['first_name'] + '</td> \
                        <td class="last">' + user['last_name'] + '</td> \
                        <td class="email">' + user['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm approveButton">' + etgLogic.generateSVG('check') + '</button></td>\
                        <td><button type="button" class="btn btn-sm denyButton">' + etgLogic.generateSVG('close') + '</button></td>\
                    </tr>';
        return entry;
    }
    
    function generatePendingEssay(essay) {
        var popoverMeta = 'data-toggle="popover" data-container="body" data-placement="right" title="Marker Preview" data-content=""';
        var marker = essay['marker'];
        var entry = '<tr class="pendingEssay"> \
                        <input type="hidden" name="markerId" value="' + marker['id'] + '"> \
                        <input type="hidden" name="essayId" value="' + essay['id'] + '"> \
                        <input type="hidden" name="markerLat" value="' + marker['latitude'] + '"> \
                        <input type="hidden" name="markerLng" value="' + marker['longitude'] + '"> \
                        <td class="title">' + essay['title'] + '</td> \
                        <td class="address">' + essay['marker'][0]['address'] + '</td> \
                        <td class="email">' + essay['user'][0]['email'] + '</td> \
                        <td><button type="button" class="btn btn-sm approveButton">' + etgLogic.generateSVG('check') + '</button></td>\
                        <td><button type="button" class="btn btn-sm denyButton">' + etgLogic.generateSVG('close') + '</button></td>\
                        <td class="markerLocation ' + popoverMeta + '>' + etgLogic.generateSVG('map', 'pendingLocation') + '</td> \
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
                        ' + ((type === 'essays') ? '<th>View Location</th>' : '') + '\
                     </tr>'
        return header;
    }
    
    function swapUploadToPopup(element, content) {
        element.html("<div class='mapEssayLink'> \
            <h6 class='essayLinkTitle'>" + content['essayTitle'] + "</h6> \
            <a href='" + content['docLink'] + "' type='button' class='eassayLinkButton btn btn-sm btn-info' target='_blank'>View</a> \
        </div>");
    }
    
}( window.etgLogic = window.etgLogic || {}, jQuery ));