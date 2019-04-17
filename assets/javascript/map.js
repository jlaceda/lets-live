"use strict";

// Map object
let map = {
    // Bounds object
    markerBounds: new L.LatLngBounds(),

    // Position marker
    posMarker: L.circleMarker([47.6062, -122.3321]),

    // Array of venue markers
    venueMarkerArray: [],

    // Map display object
    display: L.map("map").setView([47.6062, -122.3321], 13),

    // Add tile layer to map display
    addTileLayer: function() {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
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
        map.posMarker = L.circleMarker(currentPosition).addTo(map.display);

        // Extend the marker bounds
        map.markerBounds.extend(map.posMarker.getLatLng());
    },

    // Create the markers for every venue
    createVenueMarkers: function(venues) {


        // Remove all venue markers
        for (let i = 0; i < map.venueMarkerArray.length; i++) {
            map.display.removeLayer(map.venueMarkerArray[i].venueMarker);
        }

        // Reset array of venue markers
        map.venueMarkerArray = [];

        // Reset markerBounds
        map.markerBounds = new L.LatLngBounds();
        console.log(map.markerBounds);
        // Extend the marker bounds
        map.markerBounds.extend(map.posMarker.getLatLng());

        // Create a marker with a popup for each venue
        for (let i = 0; i < venues.length; i++) {
            // console.log(`lat: ${venues[i].lat}\tlng: ${venues[i].lng}`)
            let venueMarker = L.marker([venues[i].lat, venues[i].lng], {icon: map.ticketIcon}).addTo(map.display);

            map.venueMarkerArray.push({
                venueName: venues[i].name,
                venueMarker: venueMarker
            });

            /// popup
            const showDivTemplate = show =>`
            <li>
                <div class="showPopup p-1">
                    <h6>${show.artist}</h6> 
                    <p>${show.displayDate}<br>
                    ${show.displayTime}<br>
                    <a href="${show.tmUrl}" target="_blank">Tickets</a></p>
                </div>
            </li>
            `;

            // construct html for list
            const venue = venues[i];
            let markup = `
            <div class="venuePopup" style="max-height: 100px; overflow-y: scroll;">
                <h5>${venue.name}</h5>
                <ul>
                ${venue.shows.map(showDivTemplate).join('')}
                </ul>
            </div>
            `

            // Add the popup to the marker
            venueMarker.bindPopup(markup);

            // Extend the marker bounds to include the new venue marker
            map.markerBounds.extend(venueMarker.getLatLng());

        }

        // Zoom to fit all the markers
        map.display.fitBounds(map.markerBounds);

        // When the "All Venues" button is clicked
        $("#all-venues").on("click", function() {
            // Zoom to fit all the markers
            map.display.fitBounds(map.markerBounds);
        });
    }
}