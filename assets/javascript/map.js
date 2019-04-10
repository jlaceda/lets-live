$(document).ready(function () {
    let mapDisplay = L.map("map").setView([47.6062, -122.3321], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibXJnbWFjYW5kb2ciLCJhIjoiY2plMGFydTNhMGZvZjJ3cXQxMXh0czV5ZSJ9.wLEGScCuILcHiezNwPpzaw'
    }).addTo(mapDisplay);

    function getLocation() {
        navigator.geolocation.getCurrentPosition(function(location) {
        
            let latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

            yourLocation = L.marker(latlng).addTo(mapDisplay);
            console.log(latlng);

            mapDisplay.flyTo(latlng, 16);
        });
    }


    getLocation();
});