"use strict";

/** This function returns an arrayOfShows from the Metro Area of given lat, lng*/
const getNearestShows = (() =>
{
	// using api.jsonbin.io for testing before we have a songkick api key
	const TEST_LOCATION_SEARCH_URL = "https://api.jsonbin.io/b/5cae644d814711458b3f5717";
	const TEST_METRO_AREA_URL = "https://api.jsonbin.io/b/5cae63ad1a3c794543f8a16e/2";
	const TEST_JSONBIN_IO_SECRET_HEADER = new Headers({'secret-key': '$2a$10$yfjblcaxkd4ld8O0rI0mResVAAvw7/wQ8icwRdYxH2SIO68xPSfiq'});
	// uncomment when we have a songkick api key
	//const SONGKICK_API_KEY = "PLACEHOLDER_FOR_WHEN_WE_GET_IT";

	const filterRawResponse = (rawResponse) =>
	{
		if (rawResponse.status === 200)
		{
			return rawResponse.json();
		}
		throw new Error("Something went wrong on api server!");
	};

	const getMetroAreaIdFromResponse = (response) =>
	{
		if (response.resultsPage.status === "ok")
		{
			// get the metroAreaId
			// only take the first localtion
			return response.resultsPage.results.location[0].metroArea.id;
		}
		throw new Error("Error response from songkick response");
	};

	const getShowsInArea = (metroAreaId) =>
	{
		// uncomment when we have a songkick api key
		//const metroAreaQueryUrl = `https://api.songkick.com/api/3.0/metro_areas/${metroAreaId}/calendar.json?apikey=${SONGKICK_API_KEY}`;
		//const metroAreaRequest = new Request(metroAreaQueryUrl);
		const metroAreaRequest = new Request(TEST_METRO_AREA_URL, {headers: TEST_JSONBIN_IO_SECRET_HEADER});

		return fetch(metroAreaRequest)
			// handle non-200 status
			.then(filterRawResponse)
			.catch(error => console.error(error));
	};

	const makeShowsArrayFromResponse = (response) =>
	{
		if (response.resultsPage.status === "ok")
		{
			const eventArray = response.resultsPage.results.event;
			let arrayOfShows = []
			eventArray.forEach(event =>
			{
				arrayOfShows.push({
					name: event.venue.displayName,
					lng: event.venue.lng,
					lat: event.venue.lat,
					time: event.start.time,
					date: event.start.date,
					artist: event.performance[0].displayName
				})
			});
			return new Promise((resolve) =>
			{
				resolve(arrayOfShows);
			});
		}
		throw new Error("Non OK status from songkick response");
	};

	// long function that takes in (lat,lng)
	// hits locations api for the metroAreaId
	// then hits metro_areas api
	return (lat,lng) =>
	{
		// uncomment when we have a songkick api key
		//const locationQueryUrl = `https://api.songkick.com/api/3.0/search/locations.json?location=geo:${lat},${lng}&apikey=${SONGKICK_API_KEY}`;
		//const locationSearchRequest = new Request(locationQueryUrl);
		const locationSearchRequest = new Request(TEST_LOCATION_SEARCH_URL, {headers: TEST_JSONBIN_IO_SECRET_HEADER});
		
		return fetch(locationSearchRequest)
			// handle non-200 status
			.then(filterRawResponse)
			// return metroAreaId
			.then(getMetroAreaIdFromResponse)
			// hit metro_areas api for shows
			.then(getShowsInArea)
			.then(makeShowsArrayFromResponse)
			.catch(error => console.error(error));
	};
})();

// USAGE EXAMPLE with fake lat lng
getNearestShows(30,30)
	.then(shows => console.log(shows))
	.catch(error => console.error(error));
