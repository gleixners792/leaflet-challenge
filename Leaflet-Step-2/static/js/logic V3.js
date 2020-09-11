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
      return "#e1f34d";
    case scale = 1:
      return "#b7f34d";
    case scale = 2:
      return "#f3db4d";
    case scale = 3:
      return "#f3ba4d";
    case scale = 4:
      return "#f0a76b";
    default:
      return "#f06b6b";
  }
}


// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log("data--> ", data);

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  //function onEachFeature(feature, layer) {
  //  layer.bindPopup("<h3>" + feature.properties.place +
  //    "</h3><hr><p>" + new Date(feature.properties.time) +
  //    "</h3><hr><p>" + "Magnitude>>> " + feature.properties.mag + "</p>");
  //}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array

  //var earthquakes = L.geoJSON(data, {
  //  onEachFeature: onEachFeature
  //});

  //var geojsonMarkerOptions = {
  // radius: 15,
  //  fillColor: "#ff7800",
  //  color: "#000",
  //  weight: 1,
  //  opacity: 1,
  //  fillOpacity: 0.8
  //};


  // var earthquakes = L.geoJSON(data, {
  //    pointToLayer: function (feature, latlng) {
  //      return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup("<h3>" + feature.properties.place +
  //      "</h3><hr><p>" + new Date(feature.properties.time) +
  //      "</h3><hr><p>" + "Magnitude>>> " + feature.properties.mag + "</p>");
  //    }
  //  });

  var earthquakes = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      //console.log("Magnitude--> ",feature.properties.mag);
      return L.circle(latlng, {
        radius: feature.properties.mag * 10000,
        fillColor: chooseColor(Math.floor(feature.properties.mag)),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
        .bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) +
          "</h3><hr><p>" + "Magnitude>>> " + feature.properties.mag + "</p>");
    }

  });


  // var magnitudeMarkers = [];

  //console.log("1st Mag", data.features[0].properties.mag);
  //console.log("2nd Mag", data.features[1].properties.mag);


  // Loop through locations and create city and state markers
  //for (var i = 0; i < data.features.length; i++) {
  //  console.log("I is -->", i+1, "Size --> ", data.features[i].properties.mag);
  //  console.log("Location--> ", data.features[i].properties.place)
  // Setting the marker radius for the state by passing population into the markerSize function
  //  magnitudeMarkers.push(
  //    L.circle(data.features[i].geometry.coordinates, {
  //     stroke: false,
  //      fillOpacity: 0.75,
  //      color: "white",
  //      fillColor: "white",
  //      radius: markerSize(data.features[i].properties.mag)
  //    })
  //  );
  //}

  // console.log("magnitudeMarkers--> ",magnitudeMarkers);

  // Setting the marker radius for the city by passing population into the markerSize function
  //cityMarkers.push(
  //  L.circle(locations[i].coordinates, {
  //    stroke: false,
  //    fillOpacity: 0.75,
  //    color: "purple",
  //    fillColor: "purple",
  //    radius: markerSize(locations[i].city.population)
  //  })
  //);

  // Define lightmap and darkmap layers

  console.log("earthquakes-->", earthquakes);

  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });

  //var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  //  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //  maxZoom: 18,
  //  id: 'mapbox/dark-v10',
  //  tileSize: 512,
  //  zoomOffset: -1,
  //  accessToken: API_KEY
  //});

  // Define a baseMaps object to hold our base layers
  //var baseMaps = {
  //  "Light Map": lightmap,
  //  "Dark Map": darkmap
  //};

  //var magnitudes = L.layerGroup(magnitudeMarkers);

  //console.log("Magnitudes--> ", magnitudes);
  //console.log("Earthquakes #2--> ", earthquakes);

  // Create overlay object to hold our overlay layer
  //var overlayMaps = {
  //  Earthquakes: earthquakes,
  //  Magnitudes: magnitudes
  //};

  //var overlayMaps = {
  //  Earthquakes: earthquakes
  //};

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  //var myMap = L.map("map", {
  //  center: [
  //    37.09, -95.71
  //  ],
  //  zoom: 4,
  //  layers: [lightmap, earthquakes]

  //});

  var legend = L.control({ position: 'bottomright' });

  legend.addTo = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];


    // console.log("Grades--> ", grades);
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      // console.log("grades--> ", grades[i]);
    }

    return div;
  };

  // legend.addTo(map);

  console.log("Legend--> ", legend);

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [lightmap, earthquakes]

  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  //L.control.layers(baseMaps, overlayMaps, {
  //  collapsed: false
  //}).addTo(myMap);

});
