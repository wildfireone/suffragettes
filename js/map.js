/**
 * @Author: John Isaacs <john>
 * @Date:   20-Mar-192019
 * @Filename: map.js
 * @Last modified by:   john
 * @Last modified time: 20-Mar-192019
 */



var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var mymap = L.map('mapid').setView([57.1497, -2.0943], 13);
CartoDB_Positron.addTo(mymap);


$.getJSON( "/suffragettes/suffra2.json", function( data ) {
  data.forEach(function(location){
    console.log(location)
    var m = L.marker([location.lat, location.lng]).addTo(mymap);
    var title = location["pin-title"]
    var loc = location['location']
    var desc = location['text']
		var photoSrc = location['photos']
		var photoSrcs = photoSrc.split(' ');
		var photoString ="";
		for(i=0; i<photoSrcs.length; i++){
			photoString = photoString + "<img class='popupimg' src='"+photoSrcs[i]+"' />"
		}
    m.bindPopup("<b>"
    +title+"</b><br>"
    +loc+"<br>"
    +desc+"<br>"
    +"<p>"+photoString+"</p>"
  )
  })
});
