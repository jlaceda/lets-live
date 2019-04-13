"use strict";

const displayNearestShowsList = () =>
{
	const showDivTemplate = show =>`
	<div class="show p-2 m-1" style="background-color:rgba(0,0,0,0.5)"
		data-lat="${show.lat}" data-lng="${show.lng}">
		<h3>${show.artist}</h3> 
		<h4>${show.name}</h4>
		<h5>${show.date} ${show.time}</h5>
	</div>`;

	const processShowObjects = shows =>
	{
		// construct html for list
		// write html to dom
		let listDiv = document.getElementById("list");
		listDiv.style = "overflow: scroll;";
		// TODO: better markup
		listDiv.innerHTML = shows.map(showDivTemplate).join('');
	};

	// get user's current location
	navigator.geolocation.getCurrentPosition(
		// success callback
		position =>
			getNearestShows(position.coords.latitude,position.coords.longitude)
				.then(processShowObjects)
				.catch(error => console.error(error))
		,
		// error callback
		error => console.warn(`ERROR(${error.code}): ${error.message}`)
		,
		// position options
		{
			enableHighAccuracy: true,
			//timeout: 5000,
			maximumAge: 60000 // one minute
		}
	)
}

// USAGE EXAMPLE
displayNearestShowsList();