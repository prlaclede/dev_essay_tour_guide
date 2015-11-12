/*loadScript('https://maps.googleapis.com/maps/api/js?v=3.key=AIzaSyDeovcMJI1fqgbiZeyKwNDiBI3N8ghcmEc',
          function() { 
            console.log('google-loader has been loaded, but not the maps-API ');
          });
          
function loadScript(src,callback){

  var script = document.createElement("script");
  script.type = "text/javascript";
  if(callback)script.onload=callback;
  script.src = src;
  document.body.appendChild(script);
}
*/
var map;
var markAddr;

$(function (mapsLogic, $, undefined) {
  
  console.log('maps-API has been loaded, ready to use');
  
  var mapProp = {
    center: new google.maps.LatLng(38.301461, -77.473635),
    zoom: 15,
    panControl:true,
    zoomControl:true,
    mapTypeControl:true,
    scaleControl:true,
    streetViewControl:true,
    overviewMapControl:true,
    rotateControl:true, 
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#googleMap")[0], mapProp);
  $(window).resize(function() {
    google.maps.event.trigger($("#googleMap")[0], 'resize');
  });
  
  google.maps.event.addListener(map,'center_changed', function() { checkBounds(); });
 
  google.maps.event.addListener(map,'resize', function() { resize(); });
  
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if (map.getZoom() < 13) map.setZoom(13);
  });
  
  var allowedBounds = new google.maps.LatLngBounds (
   new google.maps.LatLng(38.273763, -77.485478), 
   new google.maps.LatLng(38.352718, -77.460838)
  );
  
  function checkBounds() {    
    if (!allowedBounds.contains(map.getCenter())) {
      var C = map.getCenter();
      var X = C.lng();
      var Y = C.lat();
  
      var AmaxX = allowedBounds.getNorthEast().lng();
      var AmaxY = allowedBounds.getNorthEast().lat();
      var AminX = allowedBounds.getSouthWest().lng();
      var AminY = allowedBounds.getSouthWest().lat();
  
      if (X < AminX) {X = AminX;}
      if (X > AmaxX) {X = AmaxX;}
      if (Y < AminY) {Y = AminY;}
      if (Y > AmaxY) {Y = AmaxY;}
  
      map.setCenter(new google.maps.LatLng(Y,X));
    }
  }
  
  var markerGet = $.getJSON("/loadMarkers");

  var essayGet = $.getJSON("/loadMarkerEssays");
  
  $.when(markerGet).done(function(markerResponse) {
    var markers = markerResponse['markerList'];
    $.each(markers, function() {
      var marker = this;
      $.getJSON("/loadMarkerEssays", {
        markerID: this['id']
      }).done(function(essayResponse) {  
        var essay = essayResponse['essayList'][0];
        placeMarkers(marker, essay);
      });
    });
  });
  
  var newMarkerListener;
  
  $('#mapAddToggle').on('click', function() {
    console.log('add marker');
    $.getJSON('/setMapMode', {
      mode: 'edit'
    }).done(function(response) {
      newMarkerListener = google.maps.event.addListener(map, 'click', function(event) {
        if (allowedBounds.contains(event.latLng)) {
         mapsLogic.placeNewMarker(event.latLng);
        }
      });
    });
  });
  
  $('#mapViewToggle').on('click', function() {
    $.getJSON('/setMapMode', {
      mode: 'view'
    }).done(function(response) {
      console.log(response);
      newMarkerListener.remove();
    });
  });
  
  function placeMarkers(markerJSON, essayJSON) {
    var currentMarker;
    var newMarker = new google.maps.Marker ({
      position: new google.maps.LatLng(markerJSON['latitude'], markerJSON['longitude']),
      animation: google.maps.Animation.DROP,
    });
    if (essayJSON != undefined) {
      console.log(markerJSON);
      var infoWindow = new google.maps.InfoWindow ({
        content: getEssays(markerJSON)
      });
      google.maps.event.addListener(newMarker, 'click', function() {
        currentMarker = this;
        if (newMarker.getAnimation() !== null) {
          newMarker.setAnimation(null);
        } else {
          newMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
        infoWindow.open(map, newMarker);
        essayInfoTab(essayJSON);
      });
      google.maps.event.addListener(infoWindow, 'closeclick', function() {
         currentMarker.setAnimation(null);
      });
    }
    newMarker.setMap(map);
  }
  
  function getEssays(markerJSON) {
    var essayLink = "<div class='mapEssayLink'> \
                        <h6 class='essayLinkTitle'>" + markerJSON['address'] + "</h6> \
                        <p>" + markerJSON['address'] + ", " + markerJSON['longitude'] + " \
                      </div>";
    return essayLink;
  }
  
  function essayInfoTab(essayJSON) {
    var essayTitle = essayJSON['title'].replace(/(.*)\.(.*?)$/, "$1");
    $('.essayTabs').find('li.active').removeClass('active');
    $('.essayTabContent').find('div.active.in').removeClass('active in');
    $('.essayTabs').append("<li class='active'> \
                              <a data-toggle='tab' href='#" + essayJSON['id'] + "'>" + essayJSON['title'] + " \
                                <span class='closeTab'>" + etgLogic.generateSVG('close') + "</span> \
                              </a> \
                            </li>");
    $('.essayTabContent').append("<div id='" + essayJSON['id'] + "' class='tab-pane fade in active'> \
                                    <h3>" + essayJSON['title'] + "</h3> \
                                    <a href='" + essayJSON['doc_link'] + "' type='button' class='eassayLinkButton btn btn-sm btn-info' target='_blank'>View</a> \
                                  </div>");
  }
  
  function generateUploadForm(location) {
    var uploadForm = "<div class='essayUploadLink' lat=" + location['G'] + " long=" + location['K'] + " addr=" + mapsLogic.geocodeLatLng(location['G'], location['K']) + "> \
                        <h6 class='essayLinkTitle'>Upload Essay</h6> \
                        <form id='newFileForm' name='newFileForm' method='post' enctype='multipart/form-data'> \
                          <input id='newFile' type='file' name='file' accept='application/vnd.openxmlformats-officedocument.wordprocessingml.document'> \
                          <button type='button' class='submitEssay btn btn-sm btn-info'>Submit</button> \
                        </form>\
                      </div>";
    return uploadForm;
  }
  
  mapsLogic.placeNewMarker = function(location) {
    var marker = new google.maps.Marker({
      position: location, 
      map: map
    });
    var infoWindow = new google.maps.InfoWindow ({
      content: generateUploadForm(location)
    });
    infoWindow.open(map, marker);
    newMarkerListener.remove();
    
    $('#mapAddToggle').closest('li').removeClass('selectedMode');
    $('#mapViewToggle').closest('li').addClass('selectedMode');
  }
  
  mapsLogic.geocodeLatLng = function (lat, lng) {
    var geocoder = new google.maps.Geocoder();
    gLatLng = {'lat': parseInt(lat), 'lng': parseInt(lng)};
    geocoder.geocode({'location': gLatLng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          markAddr = (results[1].formatted_address);
        } else {
          markAddr = ('error, no address found');
        }
      } else {
          console.log("Geocoder failed due to: " + status);
      }
    });
  }
  
  mapsLogic.returnMarkAddr = function () {
    return markAddr;
  }
  
}( window.mapsLogic = window.mapsLogic || {}, jQuery ));
