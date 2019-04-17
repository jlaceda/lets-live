"use strict";

const createShowFromEvent = (venues, event) => {
	// only looks at the first artist right now
	// substitutes the event name if there's no attractions
	// TODO: maybe look at the openers also?
	let artist = (event._embedded.attractions === undefined) ?
		event.name : event._embedded.attractions[0].name;
	let venueName = event._embedded.venues[0].name;

	let venue = venues.filter(venueInner => {
		return venueInner.name === venueName;
	});
	if (venue.length > 1) return;
	let v = {};
	if (venue.length === 0) {
		// create a venue
		v = {
			name: event._embedded.venues[0].name,
			shows: []
		};

		if (event._embedded.venues[0].location === undefined)
		{
			console.log("venue doesn't have lat long");
			// TODO: Do a GPS look up from the address
			// for now just 30 30
			v.lng = 30;
			v.lat = 30;
		} else {
			v.lng = event._embedded.venues[0].location.longitude;
			v.lat = event._embedded.venues[0].location.latitude;
		}

		if (event._embedded.venues[0].country.countryCode === "US") {
			v.address = [
				event._embedded.venues[0].address.line1,
				event._embedded.venues[0].city.name,
				event._embedded.venues[0].state.stateCode,
				"US"
			]
		}
		venues.push(v);
		
	} else {
		v = venue[0];
	}

	let date = moment(event.dates.start.localDate, "YYYY-MM-DD").format('dddd, MMMM Do YYYY');
	let time = moment(event.dates.start.localTime, "HH:mm:ss").format("h:mm a");
	

	v.shows.push({
		time: event.dates.start.localTime,
		date: event.dates.start.localDate,
		displayDate: date,
		displayTime: time,
		artist: artist,
		tmUrl: event.url
	});
}