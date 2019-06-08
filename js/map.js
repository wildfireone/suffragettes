/**
 * @Author: John Isaacs <john>
 * @Date:   20-Mar-192019
 * @Filename: map.js
 * @Last modified by:   john
 * @Last modified time: 20-Mar-192019
 */

/* Define map options and initialise ---------------------- */
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
  layers: [ OldMaps, CartoDB_Positron ]
});

// Add layers control to map with options set to not collapse into icon
var baseMaps = {
  "Historic": OldMaps,
  "Modern": CartoDB_Positron
};
L.control.layers(baseMaps, null, { collapsed: false }).addTo(mymap);
$('<h6 id="map-title">Map:</h6>').insertBefore('div.leaflet-control-layers-base');

// Define available map icons for points
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

/* Add points to map ---------------------- */
$.getJSON("suffra2.json", function (data) {
  // Create the collection of markers with options for clustering with MarkerCluster
  var markers = L.markerClusterGroup({ spiderfyDistanceMultiplier: 2, maxClusterRadius: 40 });

  data.forEach(function (location) {
    //console.log(location)
    var m = L.marker([location.lat, location.lng], { icon: blueIcon })
    // Set options for this marker
    m.setBouncingOptions({
      bounceHeight: 20,    // height of the bouncing
      bounceSpeed: 50,    // bouncing speed coefficient
      exclusive: true,  // if this marker bouncing all others must stop
    }).on('click', function () {
      // Set onclick behaviour for this marker
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
    // Bind popup to this marker
    m.bindPopup('<strong>' + location['pin-title'] + '</strong><span class="d-md-none"><br><a class="js-scroll-trigger" href="#sidebar">More info &rarr;</a></span>');

    // Add this marker as a layer to collection of markers
    markers.addLayer(m);
  })

  // Apply all marker layers ot map
  mymap.addLayer(markers);
  // Zoom the map to fit all markers
  mymap.fitBounds(markers.getBounds());
});

// Reset bouncing markers
var resetAllMarkers = function () {
  var marker;
  L.Marker._bouncingMarkers.forEach(function(marker){
    marker._bouncingMotion.isBouncing = false;
    marker.setIcon(blueIcon);   // stop bouncing
  });
};

/* Show sidebar ---------------------- */
function showSidebar(location) {
  $("#mapid").removeClass("col-md-12")
  $("#mapid").addClass("col-md-8")
  $("#sidebar").removeClass("col-md-0")
  $("#sidebar").addClass("col-md-4")
  $("#sidebar").show();
  // Get values from data source
  var title = location["pin-title"]
  var loc = location['location']
  var desc = location['text']
  var photoSrc = location['photos']
  var photoSrcs = photoSrc.split(' ');
  var photoCap = location['captions']
  var photoCaps = photoCap.split('|');
  var photoString = "";
  // Curate sidebar photo content
  for (i = 0; i < photoSrcs.length; i++) {
    if(photoSrc[i]) {
      photoString = photoString + "<figure class='figure'><a href='" + photoSrcs[i] + "' data-lightbox='image'" + loc + " data-title='" + loc + (photoCaps[i] ? ": " + photoCaps[i] : "") + "'><img class='popupimg img-thumbnail figure-img img-fluid rounded' src='" + photoSrcs[i] + "' /></a>" + (photoCaps[i] ? "<figcaption class='figure-caption'>Photo: " + photoCaps[i] + "</figcaption>" : "") + "</figure>"
    }
  }
  // Curate sidebar content
  var content = "<div class='pop card'><div class='card-body'><h5 class='card-title'>" + title + "<button type='button' class='close' aria-label='Close sidebar' onclick='hideSideBar()'><span aria-hidden='true'>&times;</span> </button>" + "</h5><hr><span class='text-uppercase'><i class='fas fa-map-marker-alt'></i> " + loc + "</span><hr>" + desc + "<hr>" + "<p>" + photoString + "</p><span class='d-md-none'><a class='js-scroll-trigger' href='#mapid'>Back to map &uarr;</a></span></div></div>"

  // Set sidebar content
  $('#sidebar').html(content);
  //console.log("sidebar on")
  //console.log(title)
}

/* Hide sidebar ---------------------- */
function hideSideBar() {
  $("#sidebar").removeClass("col-md-4")
  $("#sidebar").addClass("col-md-0")
  $("#mapid").removeClass("col-md-8")
  $("#mapid").addClass("col-md-12")
  $("#sidebar").hide();
  //console.log("sidebar hidden")
}
