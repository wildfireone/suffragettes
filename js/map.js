/**
 * @Author: John Isaacs <john>
 * @Date:   20-Mar-192019
 * @Filename: map.js
 * @Last modified by:   john
 * @Last modified time: 20-Mar-192019
 */

var mapBounds = new L.LatLngBounds(
  new L.LatLng(49.852539, -7.793077),
  new L.LatLng(60.894042, 1.790425));
var mapMinZoom = 1;
var mapMaxZoom = 17;




var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var OldMaps = L.tileLayer('http://nls-{s}.tileserver.com/nls/{z}/{x}/{y}.jpg', {
  minZoom: mapMinZoom, maxZoom: mapMaxZoom,
  bounds: mapBounds,
  attribution: 'Historical Maps Layer, 1919-1947 from the <a href="http://maps.nls.uk/projects/api/">NLS Maps API</a>',
  opacity: 0.85,
  subdomains: '0123'
});

var mymap = L.map('mapid', {
  center: [57.1497, -2.0943],
  zoom: 13,
  layers: [ OldMaps,CartoDB_Positron]
});

var baseMaps = {

  "Historic": OldMaps,
  "Modern": CartoDB_Positron
};

L.control.layers(baseMaps).addTo(mymap);

var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



//CartoDB_Positron.addTo(mymap);

$.getJSON("suffra2.json", function (data) {
  var markers = L.markerClusterGroup({ spiderfyDistanceMultiplier: 2, maxClusterRadius: 40 });
  data.forEach(function (location) {
    //console.log(location)
    var m = L.marker([location.lat, location.lng], { icon: blueIcon })

    m.setBouncingOptions({
      bounceHeight: 20,    // height of the bouncing
      bounceSpeed: 50,    // bouncing speed coefficient
      exclusive: true,  // if this marker bouncing all others must stop
    }).on('click', function () {

      resetAllMarkers();
      this.toggleBouncing();
      if (this.isBouncing()) {
        this.setIcon(redIcon);
        showSidebar(location);
      }
      else {
        resetAllMarkers();
        this.setIcon(blueIcon);
        hideSideBar();
      }
    });

    m.bindPopup('<strong>' + location['pin-title'] + '</strong><span class="d-lg-none"><br><a class="js-scroll-trigger" href="#sidebar">More info &rarr;</a></span>');

    markers.addLayer(m);
  })
  mymap.addLayer(markers);
  mymap.fitBounds(markers.getBounds());
});

resetAllMarkers = function () {
  var marker;
  L.Marker._bouncingMarkers.forEach(function(marker){
    marker._bouncingMotion.isBouncing = false;
    marker.setIcon(blueIcon);   // stop bouncing
  });

};

function showSidebar(location) {
  $("#mapid").removeClass("col-md-12")
  $("#mapid").addClass("col-md-8")
  $("#sidebar").removeClass("col-md-0")
  $("#sidebar").addClass("col-md-4")
  $("#sidebar").show();
  var title = location["pin-title"]
  var loc = location['location']
  var desc = location['text']
  var photoSrc = location['photos']
  var photoSrcs = photoSrc.split(' ');
  var photoString = "";

  for (i = 0; i < photoSrcs.length; i++) {
    photoString = photoString + "  <a href='" + photoSrcs[i] + "' data-lightbox='image'" + loc + " data-title='" + loc + "'><img class='popupimg img-thumbnail' src='" + photoSrcs[i] + "' /></a>"
  }


  var content = "<div class='pop card'><div class='card-body'><b>" + title + "</b><hr><span class='text-uppercase'><i class='fas fa-map-marker-alt'></i> " + loc + "</span><hr>" + desc + "<hr>" + "<p>" + photoString + "</p><span class='d-lg-none'><a class='js-scroll-trigger' href='#mapid'>Back to map &uarr;</a></span></div></div>"
  $('#sidebar').html(content);
  //console.log("sidebar on")
  //console.log(title)

}

function hideSideBar() {
  $("#sidebar").removeClass("col-md-4")
  $("#sidebar").addClass("col-md-0")
  $("#mapid").removeClass("col-md-8")
  $("#mapid").addClass("col-md-12")
  $("#sidebar").hide();
  //console.log("sidebar hidden")
}
