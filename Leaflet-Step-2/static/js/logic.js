// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

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
  console.log("Earthquake data--> ", data);
  d3.json(platesUrl, function (pData) {
    console.log("Plate data--> ", pData);

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

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
            "</h3><hr><p>" + "Magnitude>>> " + feature.properties.mag + "</p>");
      }

    });

    // create another GeoJSON layer to display the faultlines on the map.
    var faultlines = L.geoJSON(pData, {
      style: function (feature) {
        return {
          color: "#ff9c2a",
          weight: 1.5
        }
      }
    });

    // console.log("earthquakes-->", earthquakes);
    // console.log("Fault--> ", faultlines);

    // Define sataellite, grayscale and outdoor layers
    var satmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
    });

    var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
    });

    var outdoormap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/outdoors-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satmap,
      "Grayscale": graymap,
      "Outdoors": outdoormap
    };


    // Create overlay object to hold our overlay layer

    var overlayMaps = {
      FaultLines: faultlines,
      Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    // Zoom at 3
    var myMap = L.map("map", {
      center: [
        40.7608, -111.8910
      ],
      zoom: 3,
      layers: [satmap, faultlines, earthquakes]
    });

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {
      // console.log(" **in legend function** ");

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

    // console.log("Legend--> ", legend);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  })
})
