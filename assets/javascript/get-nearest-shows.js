"use strict";

/** This function returns an array of shows from the area of given lat, lng */
const getNearestShows = (() => {
	const TICKETMASTER_API_KEY = `iYNITBvIAGCRrEmnvVY1ugT1EPxdLE4l`;

	const filterRawResponse = (rawResponse) => {
		if (rawResponse.status === 200) {
			return rawResponse.json();
		}
		throw new Error("Something went wrong on api server!");
	};

	const buildlocalStartDateTimeString = () => {
		
		const now = moment();
		let startYear = now.format('YYYY')
		let startMonth = now.format('MM');
		let startDay = now.format('DD');
		let startTime = now.format('hh:mm:ss');

		const tomorrow = moment().add(2, 'days').endOf('day');
		let endYear = tomorrow.format('YYYY');
		let endMonth = tomorrow.format('MM');
		let endDay = tomorrow.format('DD');
		let endTime = tomorrow.format('hh:mm:ss');
	
		return `${startYear}-${startMonth}-${startDay}T${startTime},${endYear}-${endMonth}-${endDay}T${endTime}`;
	};

	return (lat, lng) => {
		const eventSearchRequestUrl = [
			`https://app.ticketmaster.com/discovery/v2/events?apikey=${TICKETMASTER_API_KEY}`,
			`latlong=${lat},${lng}`,
			`radius=10`, // TODO: maybe make radius a parameter?
			`localStartDateTime=${buildlocalStartDateTimeString()}`,
			`unit=miles`,
			`sort=date,asc`,
			`countryCode=US`,
			`segmentName=Music`].join('&');

		const eventSearchRequest = new Request(eventSearchRequestUrl);

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
					// only looks at the first artist right now
					// substitutes the event name if there's no attractions
					// TODO: maybe look at the openers also?
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
				return new Promise(resolve => resolve(shows))
			})
			.catch(error => console.error(error));
	};
})();

// // USAGE EXAMPLE with Convention Center lat lng
// getNearestShows(47.6114813,-122.3373179)
// 	.then(shows => console.log(shows))
// 	.catch(error => console.error(error));
