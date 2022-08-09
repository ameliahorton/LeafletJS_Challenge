// I got help from TA Erin Wills and collaborated with Jenna Jorstad, Nina Padgett, and Ying Sun on this assignment.

// popup
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

// circles
  function circleSize(feature){
    radius = feature.properties.mag
    return 2*radius**2;
  }

  function circleColor(feature){

    depth = feature.geometry.coordinates[2]
    if(depth < 10){
      color = "#98ee00"
    }
    else if (depth < 30){
      color = "#d4ee00"
    }
    else if (depth < 50){
      color = "#eecc00"
    }
    else if (depth < 70){
      color = "#ee9c00"
    }
    else if (depth < 90){
      color = "#ea822c"
    }
    else {
      color = "#ea2c2c"
    }
    return color
   }


 // Define streetmap and darkmap layers
 let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });

streetmap.addTo(myMap);

// create layer; will attach data later on
let earthquakes = new L.LayerGroup();

// Create overlay object to hold our overlay layer
let overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// URL
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    onEachFeature: popUpMsg,
    pointToLayer: function(feature, latlong){
       return new L.CircleMarker(latlong, {
        radius: circleSize(feature),
        fillOpacity: 0.7
      })
  },
    style: function(feature){
      return {color: circleColor(feature)}
  }
  }).addTo(earthquakes);

  earthquakes.addTo(myMap);
});

// create legend
let legend = L.control({position: 'bottomright'});
legend.onAdd = function() {
  let div = L.DomUtil.create ('div', 'legend')
  let grades = [-10, 10, 30, 50, 70, 90];
  let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML += `<i style='background:${colors[i]}'></i>
    ${grades[i]} ${grades[i+1] ? `&ndash; ${grades[i+1]} <br>` : "+"}`;
  }
  return div;
};

legend.addTo(myMap);
