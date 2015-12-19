$(function (adminLogic, $, undefined) {
    
/* ---------- jQuery listeners ---------- */

    $('body')
    
        .on('click', '#pendingUsers', function() {
            $.getJSON('/pendingUsers').done(function (response) { 
               var users = response['users'];
               $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
               $('.pendingTableHead').append(adminLogic.generateTableHeader('users'));
               $.each(users, function() {
                   adminLogic.generatePendingUser(this, $('.pendingTableBody'))
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
                  var essayHTML = adminLogic.generatePendingEssay(this, $('.pendingTableBody'));
              });
           });
           $('#pendingPopup').modal('show').find('.modal-title').html($(this).text());   
        })
        
        .on('click', '#allEssays', function() {
           $.getJSON('/getAllEssays').done(function (response) {
              var essays = response['essays'];
              $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
              $('.pendingTableHead').append(adminLogic.generateTableHeader('essays'));
              $.each(essays, function() {
                  var essayHTML = adminLogic.generatePendingEssay(this, $('.pendingTableBody'));
              });
           });
           $('#pendingPopup').modal('show').find('.modal-title').html($(this).text());   
        })
        
        .on('click', '#allUsers', function() {
           $.getJSON('/getAllUsers').done(function (response) { 
               var users = response['users'];
               $('.pendingTableBody, .pendingTableHead').html(''); //clear previous table data
               $('.pendingTableHead').append(adminLogic.generateTableHeader('users'));
               $.each(users, function() {
                   adminLogic.generatePendingUser(this, $('.pendingTableBody'))
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
                essayForm.append('driveId', row.find("input[name='driveId']").val());
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
            $(this).closest('.markerLocation').popover('show');
            var mapProp = {
                center: new google.maps.LatLng(thisLat, thisLng),
                zoom: 15,
                size: '275x275',
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var popoverId = $(this).closest('.markerLocation').attr('aria-describedby');
            var popoverContent = $('#' + popoverId).find('.popover-content').addClass('popoverMap');
            var popoverMap = new google.maps.Map(popoverContent[0], mapProp);
            //$(this).closest('.markerLocation').popover('show');
            new google.maps.Marker ({
              position: new google.maps.LatLng(thisLat, thisLng),
              animation: google.maps.Animation.DROP,
            }).setMap(popoverMap);
            
        });
        
/* ---------- end jQuery listeners ---------- */
    
    adminLogic.generatePendingUser = function (user, element) {
        $.ajax({
            url: '/generatePendingUser',
            data: user,
            type: "POST",
            dataType: "html",
            success: function(response) {
                element.append(response);
            },
            error: function (error) {
                return("error" + JSON.stringify(error));
            }
        });
    }
    
    adminLogic.generatePendingEssay = function (essay, element) {
        $.ajax({
            url: '/generatePendingEssay',
            data: essay,
            type: "POST",
            dataType: "html",
            success: function(response) {
                element.append(response);
            },
            error: function (error) {
                return("error" + JSON.stringify(error));
            }
        });
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