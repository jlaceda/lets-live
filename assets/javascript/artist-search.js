"use strict";

const artistSearch = (artistName) =>
{
	// 1. search for artists shows on songkick
	// 2. construct an array of shows object
	//	Show Object:
	//		{
	//			name: event.venue.displayName,
	//			lng: event.location.lng,
	//			lat: event.location.lat,
	//			time: event.start.time,
	//			date: event.start.date,
	//			artist: event.performance[0].displayName
	//		}
	// 3. return a Promise(?) of that aray
};