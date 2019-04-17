"use strict";
var artistSearchMod = {
    init: function () {
        this.addListeners();
    },
    addListeners: function () {
        $("#searchButton").click(function(event){
           
            event.preventDefault();
            console.log($("#searchInput").val());
            artistSearchMod.search($("#searchInput").val());
            $("#searchInput").val("");
        });
    },

    search: function (artist) {
        const TICKETMASTER_API_KEY = `iYNITBvIAGCRrEmnvVY1ugT1EPxdLE4l`;
        const eventSearchRequestUrl = [
            `https://app.ticketmaster.com/discovery/v2/events?apikey=${TICKETMASTER_API_KEY}`,
            `keyword=` + artist,
            `segmentName=Music`].join('&');

        const eventSearchRequest = new Request(eventSearchRequestUrl);

        const filterRawResponse = (rawResponse) => {
            if (rawResponse.status === 200) {
                return rawResponse.json();
            }
            throw new Error("Something went wrong on api server!");
        };
        recentSearch.add(artist);
        return fetch(eventSearchRequest)
            // handle non-200 status
            .then(filterRawResponse)
            .then((response) => {
                if (response.page.totalElements == 0) {
                    // what TODO when theres no shows?
                    throw new Error("No shows near you!");
                }
                const events = response._embedded.events;
                let shows = [];
                events.forEach(event => {
                    let artist = (event._embedded.attractions === undefined) ?
                        event.name : event._embedded.attractions[0].name;
                    shows.push({
                        name: event._embedded.venues[0].name,
                        lng: event._embedded.venues[0].location.longitude,
                        lat: event._embedded.venues[0].location.latitude,
                        time: event.dates.start.localTime,
                        date: event.dates.start.localDate,
                        artist: artist
                    });
                });
                console.log(shows);
                return new Promise(resolve => resolve(shows))
            })
            .catch(error => console.error(error));
    }
}
artistSearchMod.init();

//console.log(artistSearchMod.search(""));