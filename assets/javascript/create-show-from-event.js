"use strict";

const createShowFromEvent = (venues, event) => {
	// only looks at the first artist right now
	// substitutes the event name if there's no attractions
	// TODO: maybe look at the openers also?
	let artist = (event._embedded.attractions === undefined) ?
		event.name : event._embedded.attractions[0].name;
	let venueName = event._embedded.venues[0].name;

	let venue = venues.filter(venueInner => {
		venueInner.name === venueName;
	});
	console.log(venue)
	if (venue.length > 1) return;
	let v = {};
	if (venue.length === 0) {
		// create a venue
		v = {
			name: event._embedded.venues[0].name,
			lng: event._embedded.venues[0].location.longitude,
			lat: event._embedded.venues[0].location.latitude,
			shows: []
		};

		if (event._embedded.venues[0].country.countryCode === "US") {
			v.address = [
				event._embedded.venues[0].address.line1,
				event._embedded.venues[0].city.name,
				event._embedded.venues[0].state.stateCode,
				"US"
			]
		}
		
	} else {
		v = venue[0];
	}

	v.shows.push({
		time: event.dates.start.localTime,
		date: event.dates.start.localDate,
		artist: artist,
		tmUrl: event.url
	});
	console.log(v);
	venues.push(v);
}