"use strict";

// Map object
let map = {
 

    // Map display object
    display: L.map("map").setView([47.6062, -122.3321], 13),

    // Add tile layer to map display
    addTileLayer: function() {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibXJnbWFjYW5kb2ciLCJhIjoiY2plMGFydTNhMGZvZjJ3cXQxMXh0czV5ZSJ9.wLEGScCuILcHiezNwPpzaw'
        }).addTo(this.display);
    },

    // Create the marker for the current position and zoom to it
    createCurrPosMarker: function(location) {
        
        // Get lat and lng of current position
        
        let currentPosition = new L.LatLng(location.coords.latitude, location.coords.longitude);
        console.log(currentPosition);

        // Add marker to map display
        L.marker(currentPosition).addTo(map.display);

        // Fly and zoom to marker
        map.display.flyTo(currentPosition, 16);

        

        
    },

    // Create the markers for every venue
    createVenueMarkers: function(venues) {
        for (let i = 0; i < venues.length; i++) {
            console.log(`lat: ${venues[i].lat}\tlng: ${venues[i].lng}`)
            let venueMarker = L.marker([venues[i].lat, venues[i].lng]).addTo(map.display);
            let popup = venues[i].name + "<br>" +
                        venues[i].artist + "<br>" +
                        venues[i].date + "<br>" +
                        venues[i].time + "<br>";
            venueMarker.bindPopup(popup);
        }
    }

}

// map.addTileLayer();
// map.createCurrPosMarker();
