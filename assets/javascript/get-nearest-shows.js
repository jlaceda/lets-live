"use strict";

/** This function returns an array of shows from the area of given lat, lng */
const getNearestShows = (() =>
{
	const TICKETMASTER_API_KEY = `iYNITBvIAGCRrEmnvVY1ugT1EPxdLE4l`;

	const filterRawResponse = (rawResponse) =>
	{
		if (rawResponse.status === 200)
		{
			return rawResponse.json();
		}
		throw new Error("Something went wrong on api server!");
	};

	const buildlocalStartDateTimeString = () =>
	{
		// goal: 
		//		2019-04-11T00:00:00,2019-04-12T00:00:00
		// or use wildcard:
		//		*,2019-04-12T00:00:00
		//
		// TODO: this has problems at the end of months/years,
		// probably should bring in moment.js for this
		const now = new Date();

		let year = now.getFullYear();
		let day = now.getDate() + 1;
		let month = now.getMonth() + 1;

		day = (day < 10) ? "0" + day : day;
		month = (month < 10) ? "0" + month : month;

		return `*,${year}-${month}-${day}T00:00:00`;
	};

	return (lat,lng) =>
	{
		const eventSearchRequestUrl = [
			`https://app.ticketmaster.com/discovery/v2/events?apikey=${TICKETMASTER_API_KEY}`,
			`latlong=${lat},${lng}`,
			`radius=5`, // TODO: maybe make radius a parameter?
			`localStartDateTime=${buildlocalStartDateTimeString()}`,
			`unit=miles`,
			`sort=date,asc`,
			`countryCode=US`,
			`segmentName=Music`].join('&');

		const eventSearchRequest = new Request(eventSearchRequestUrl);

		return fetch(eventSearchRequest)
			// handle non-200 status
			.then(filterRawResponse)
			.then((response) => 
			{
				const events = response._embedded.events;
				let shows = [];
				events.forEach(event =>
				{
					shows.push({
						name: event._embedded.venues[0].name,
						lng: event._embedded.venues[0].location.longitude,
						lat: event._embedded.venues[0].location.latitude,
						time: event.dates.start.localTime,
						date: event.dates.start.localDate,
						artist: event._embedded.attractions[0].name
					});
				});
				return new Promise(resolve => resolve(shows))
			})
			.catch(error => console.error(error));
	};
})();

// USAGE EXAMPLE with fake lat lng
getNearestShows(30,30)
	.then(shows => console.log(shows))
	.catch(error => console.error(error));
