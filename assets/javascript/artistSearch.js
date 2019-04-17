"use strict";
var artistSearchMod = {
    init: function () {
        this.addListeners();
    },
    addListeners: function () {
        $("#searchButton").click(function(event){

            event.preventDefault();
            let searchInput = $("#searchInput")
            let artistName = searchInput.val().trim();
            if (artistName.length === 0)
            {
                searchInput.attr('placeholder', 'Name Required');
                return;
            }
            artistSearchMod.search(artistName);
            searchInput.val("");
            searchInput.attr('placeholder', 'Artist Search');
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
                    noShowsNearby();
                    throw new Error("No shows near you!");
                }
                let venues = [];
                const events = response._embedded.events;
                events.forEach(event => {
                    createShowFromEvent(venues, event);
                });
                return new Promise(resolve => resolve(venues))
            })
            .catch(error => console.error(error));
    }
}
artistSearchMod.init();

//console.log(artistSearchMod.search(""));