$(document).ready(function() {

    $("#svg-icons").load("static/img/icons.svg");
    
    function loadSvg(icon, addClass) {
      var image = "<div class='im " + addClass + "'> \
                    <svg viewBox='0 0 34 34'> \
                      <g> \
                        <use xlink:href='#" + icon + "'></use> \
                      </g> \
                    </svg> \
                  </div>";
      return image;
    }
});