$(function (etgLogic, $, undefined) {
    
    etgLogic.initPage = function () {
        $('[data-toggle="popover"]').popover();
        $('[data-toggle="tooltip"]').tooltip(); 
        $('#splash_modal').modal('show');
        $("#svg-icons").load("/static/img/icons.svg");
    }
    
    etgLogic.initPage();
    
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

/* ---------- jQuery listeners ---------- */

    $('body')
    
        .on('click', '.mapMode', function() {
            $('.mapMode').closest('li').removeClass('selectedMode');
            $(this).closest('li').toggleClass('selectedMode'); 
        })
        
        .on('click', '.submitEssay', function() {
            var thisPopup = $(this).closest('.essayUploadLink');
            accLogic.generateProgressBar(thisPopup);
            console.log('starting drive post');
            var fileForm = new FormData($('#newFileForm')[0]);
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
                        thisPopup.html("Your essay has been submitted for admin approval!");
                    });
                });
            });
        })
        
        /* https://jsfiddle.net/mattdlockyer/C5GBU/2/ */
        .on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        })
        
        .on('click', '.closeTab', function () {
            var $this = $(this);
            var previousTab = $this.closest('li').prev();
            var prevContent = previousTab.find('a').attr('href');
            previousTab.addClass('active');
            $(prevContent).addClass('active in');
            var tabId = $this.closest('li').attr('id');
            $(tabId).remove();
            $this.closest('li').remove(); 
        });
        
/* ---------- end jQuery listeners ---------- */     
    
    etgLogic.generateSVG = function (icon, addClass) {
      var image = "<div class='im " + addClass + "'> \
                    <svg viewBox='0 0 25 25'> \
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
                ' + message + '</div>';
        return alert;
    }
    
    etgLogic.swapUploadToPopup = function (element, content) {
        element.html("<div class='mapEssayLink'> \
            <h6 class='essayLinkTitle'>" + content['essayTitle'] + "</h6> \
            <a href='" + content['docLink'] + "' type='button' class='eassayLinkButton btn btn-sm btn-info' target='_blank'>View</a> \
        </div>");
    }
    
}( window.etgLogic = window.etgLogic || {}, jQuery ));