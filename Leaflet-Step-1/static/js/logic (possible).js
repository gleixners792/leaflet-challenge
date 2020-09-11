// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

console.log("API Key -->", API_KEY)

// Function to determine marker size based on population
function markerSize(emagnitude) {
  return emagnitude * 1000;
}

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log("data--> ", data);


  //console.log("1st Mag", data.features[0].properties.mag);
  //console.log("2nd Mag", data.features[1].properties.mag);
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4
  });


  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  }).addTo(myMap);


  // Loop through locations and create city and state markers
  for (var i = 0; i < data.features.length; i++) {
    console.log("I is -->", i + 1, "Size --> ", data.features[i].properties.mag);
    console.log("Location--> ", data.features[i].properties.place);
    console.log("Coordinates--> ", data.features[i].geometry.coordinates);
    // Setting the marker radius for the state by passing population into the markerSize function

    L.circle(data.features[i].geometry.coordinates, {
      stroke: true,
      fillOpacity: 0.75,
      color: "blue",
      fillColor: "blue",
      radius: data.features[i].properties.mag * 10000 });



    //}).bindPopup("<h3>" + data.features[i].properties.place +
    //  "</h3><hr><p>" + new Date(data.features[i].properties.time) +
    //  "</h3><hr><p>" + "Magnitude>>> " + data.features[i].properties.mag + "</p>").addTo(myMap);

  }

  // console.log("magnitudeMarkers--> ", magnitudeMarkers);

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

  // console.log("earthquakes-->", earthquakes);


});
