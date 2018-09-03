// Earthquake data link
var EarthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Tectonic plates link
var TectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Performing a GET request to the Earthquake query URL
d3.json(EarthquakeLink, function (data) {
    // Once there is a response, sending the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Creating a GeoJSON layer containing the features array on the earthquakeData object
    // Runing the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag +
                "</h3><hr><h4>Date & Time: " + new Date(feature.properties.time) + "</h4>");
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: .7,
                    stroke: true,
                    color: "black",
                    weight: .5
                })
        }      
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes)
}

function createMap(earthquakes) {
    // Creating map layers
    var streetsatellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var contrastmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.high-contrast",
        accessToken: API_KEY
    });

    var piratesmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.pirates",
        accessToken: API_KEY
    });

    // Defining a baseMaps object to hold base layers
    var baseMaps = {
        "Satelite Map": streetsatellitemap,
        "Dark Map": darkmap,
        "High Contrast": contrastmap,
        "Pirates Map": piratesmap
    };

    // Adding a tectonic plate layer
    var tectonicPlates = new L.LayerGroup();

    // Creating overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Creating our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        // center: [38.877742, -96.380979],
        center: [30,0],
        zoom: 2,
        layers: [streetsatellitemap, earthquakes, tectonicPlates]
    });


    // Adding Techtonic lines data
    d3.json(TectonicPlatesLink, function (plateData) {
        // Adding our geoJSON data, along with style information, to the tectonicplates layer.
        L.geoJson(plateData, {
            color: "red",
            weight: 3.5
        })
        .addTo(tectonicPlates);
    });

    // Creating a layer control
    // Passing in our baseMaps and overlayMaps
    // Adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // Looping through density intervals and generate a label with a colored square for each interval
        grades.forEach((value, index) => {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[index] + 1) + '"></i> ' +
            grades[index] + (grades[index + 1] ? '&ndash;' + grades[index + 1] + '<br>' : '+');
        })
        return div;
    };

    legend.addTo(myMap);
}

function getColor(d) {
    return d > 5 ? '#F30' :
            d > 4 ? '#F60' :
            d > 3 ? '#F90' :
            d > 2 ? '#FC0' :
            d > 1 ? '#FF0' :
                    '#9F3';
}

function getRadius(value) {
    return value * 40000
}




