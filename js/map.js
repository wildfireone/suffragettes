var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var mymap = L.map('mapid').setView([57.1497, -2.0943], 13);
CartoDB_Positron.addTo(mymap);


$.getJSON( "/suffragettes/suffra.json", function( data ) {
  data.forEach(function(location){
    console.log(location)
    var m = L.marker([location.Lat, location.Lng]).addTo(mymap);
    var people = location["people"]
    var loc3 = location['Location 3 (address)']
    var loc2 = location['Location 2 (town/district)']
    var loc1 = location['Location 1 (region/city)']
    var date = location['Date']
    var desc = location['Description']
    m.bindPopup("<b>"
    +people+"</b><br>"
    +loc3+"<br>"
    +loc2+"<br>"
    +date+"<br>"
    +"<p>"+desc+"</p>"
  )
  })
});
