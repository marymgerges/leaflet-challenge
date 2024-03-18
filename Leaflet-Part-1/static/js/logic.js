// Set URL for all earthquakes in the past 30 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url).then(data => {
    console.log(data);
    createMapFeatures(data.features);
});

// Create a function for the map features
function createMapFeatures(earthquakeData) {

    let earthquakes = L.geoJSON(earthquakeData, {

        // Create markers for the earthquakes on the map
        pointToLayer: function (features, coordinates) {
            let depth = features.geometry.coordinates[2];
            let geoMarkers = {
                radius: features.properties.mag * 4,
                fillColor: colors(depth),
                fillOpacity: 0.5,
                weight: 0.5
            };
            return L.circleMarker(coordinates, geoMarkers);
        },
        onEachFeature: function (features, layer) {
            layer.bindPopup(`<h3>${features.properties.place}</h3><hr>
            <p>Magnitude: ${features.properties.mag}</p>
            <p>Depth: ${features.geometry.coordinates[2]}</p>`);
            

        }
    });

    // Call the map function
    map(earthquakes);
};

// Create a function for the mapColors scale
function colors(depth) {

    // Create variable to hold colors for the map
    let mapColors = "";

    if (depth >= 90) {
        return mapColors = "#f82020";
    }
    else if (depth >= 70) {
        return mapColors = "#f17241";
    }
    else if (depth >= 50) {
        return mapColors = "#f1b032";
    }
    else if (depth >= 30) {
        return mapColors = "#f1c232";
    }
    else if (depth >= 10) {
        return mapColors = "#dbfd6c";
    }
    else {
        return mapColors = "#8cff75";
    }

};
// Create a function for the map
function map(earthquakes) {

    // Create map's base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Legend specifics
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #8cff75"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #dbfd6c"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #f1c232"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #f1b032"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #f17241"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #f82020"></i><span>90+</span><br>';

        return div;
    };

    legend.addTo(myMap);
};