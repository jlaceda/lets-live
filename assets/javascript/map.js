"use strict";

// Map object
let map = {
    markerBounds: new L.LatLngBounds(),

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

            // Create popup
            let popup = venues[i].name + "<br>" +
                        venues[i].artist + "<br>" +
                        venues[i].date + "<br>" +
                        venues[i].time + "<br>";

            /// TEST
            const showDivTemplate = show =>`
            <li>
                <div class="show p-2 m-1" style="background-color:rgba(0,0,0,0.5)">
                    <h3>${show.artist}</h3> 
                    <h5>${show.date} ${show.time}</h5>
                    <p><a href="${show.tmUrl}" target="_blank">Tickets</a></p>
                </div>
            </li>
            `;
            
            // TODO: better markup
            let markup = '';
            // construct html for list
            
            const venue = venues[i];
            markup += `
            <div class="venue p-2 m-1" style="background-color:rgba(0,0,0,0.5)">
            <h2>${venue.name}</h2>
            <ul>
            ${venue.shows.map(showDivTemplate).join('')}
            </ul>
            </div>
            `
   

            /// TEST
            venueMarker.bindPopup(markup);

            // Extend the marker bounds to include the new venue marker
            map.markerBounds.extend(venueMarker.getLatLng());

        }

        // Save center of all markers
        let markerBoundsCenter = map.markerBounds.getCenter();
        // Fly to the center of all the markers
        map.flyToMarkers(markerBoundsCenter);

        // When the "All Venues" button is clicked
        $("#all-venues").on("click", function() {
            // Fly to the center of all the markers
            map.flyToMarkers(markerBoundsCenter);
        });
    },

    // Fly to the center of all the markers
    flyToMarkers: function(centerCoords) {
        map.display.flyTo(centerCoords, 10);  // The second argument should depend on
                                              // radius when getting nearest shows
    }
}