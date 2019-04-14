"use strict";

// Map object
let map = {
    markerBounds: new L.LatLngBounds(),

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

    ticketIcon: L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Ticket.svg',
    
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    }),

    // Create the marker for the current position and zoom to it
    createCurrPosMarker: function(location) {
        // Get lat and lng of current position
        let currentPosition = new L.LatLng(location.coords.latitude, location.coords.longitude);

        // Add marker to map display
        let posMarker = L.circleMarker(currentPosition).addTo(map.display);

        // Fly and zoom to marker
        // map.display.flyTo(currentPosition, 16);

        this.markerBounds.extend(posMarker.getLatLng());
        

    },

    // Create the markers for every venue
    createVenueMarkers: function(venues) {
        // Create a marker with a popup for each venue
        for (let i = 0; i < venues.length; i++) {
            // console.log(`lat: ${venues[i].lat}\tlng: ${venues[i].lng}`)
            let venueMarker = L.marker([venues[i].lat, venues[i].lng], {icon: map.ticketIcon}).addTo(map.display);
            
            let popup = venues[i].name + "<br>" +
                        venues[i].artist + "<br>" +
                        venues[i].date + "<br>" +
                        venues[i].time + "<br>";
            venueMarker.bindPopup(popup);

            // Extend the marker bounds to include the new venue marker
            map.markerBounds.extend(venueMarker.getLatLng());

        }
        map.flyToMarkers(map.markerBounds.getCenter());
    },

    // Flys to the center of all the markers
    flyToMarkers: function(centerCoords) {
        map.display.flyTo(centerCoords, 10.5);
    }

}