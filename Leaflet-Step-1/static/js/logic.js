// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Function to determine marker color based upon the earthquake magnitude.

function chooseColor(scale) {
  // console.log("Scale Nunber-->", scale);
  switch (scale) {
    case scale = -1:
      return "white";
    case scale = 0:
      return "#98ee00";
    case scale = 1:
      return "#d4ee00";
    case scale = 2:
      return "#cebe12";
    case scale = 3:
      return "#dba33b";
    case scale = 4:
      return "#ea822c";
    default:
      return "#ff0000";
  }
}


// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log("data--> ", data);

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  // Zoom at 5.
  var myMap = L.map("map", {
    center: [
      39.1911, -106.8175
    ],
    zoom: 5
  });

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake

  var earthquakes = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      //console.log("Magnitude--> ",feature.properties.mag);
      return L.circle(latlng, {
        radius: feature.properties.mag * 18000,
        fillColor: chooseColor(Math.floor(feature.properties.mag)),
        color: "#000",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 1.0
      })
        .bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) +
          "</h3><hr><p>" + "Magnitude>>> " + feature.properties.mag + "</p>"
        );
    }

  }).addTo(myMap);
  //console.log("earthquakes-->", earthquakes);

  // create lightmap layer
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  }).addTo(myMap);


  // Create Map Legend to show the color key code of the earthquake magnitude.

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {
    //console.log(" **in the legend function** ");

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

    // loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + chooseColor(grades[i]) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
})
