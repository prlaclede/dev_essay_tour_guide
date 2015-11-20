$(function (adminLogic, $, undefined) {
    
/* jQuery listeners */

    $('body')
    
        .on('click', '#pendingUsers', function() {
            $.getJSON('/pendingUsers').done(function (response) { 
               var users = response['users'];
               $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
               $('.pendingTableHead').append(adminLogic.generateTableHeader('users'));
               $.each(users, function() {
                   $('.pendingTableBody').append(adminLogic.generatePendingUser(this));
               });
            });
            $('#pendingPopup').modal('show').find('.modal-title').html($(this).text());   
        })
        
        .on('click', '#pendingEssays', function() {
           $.getJSON('/pendingEssays').done(function (response) {
              var essays = response['essays'];
              $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
              $('.pendingTableHead').append(adminLogic.generateTableHeader('essays'));
              $.each(essays, function() {
                  $('.pendingTableBody').append(adminLogic.generatePendingEssay(this));
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
        
/* end jQuery listeners */
    
    adminLogic.generatePendingUser = function (user) {
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
    
    adminLogic.generatePendingEssay = function (essay) {
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
    
    adminLogic.generateTableHeader = function (type) {
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
    
}( window.adminLogic = window.adminLogic || {}, jQuery ));