"use strict";

// Animated scroll to id
const ascrollto = id =>
{
	let etop = $('#' + id).offset().top;
	$('html, body').animate({
	  scrollTop: etop
	}, 500);
}

const createShowList = venues =>
{
	const showDivTemplate = show =>`
	<li>
		<div class="show p-2 m-1" style="background-color:rgba(0,0,0,0.5)">
			<h3>${show.artist}</h3> 
			<h5>${show.displayDate}</h5>
			<h5>${show.displayTime}</h5>
			<p><a href="${show.tmUrl}" target="_blank">Tickets</a></p>
		</div>
	</li>
	`;
	
	let listDiv = document.getElementById("list");
	listDiv.style = "overflow: scroll;";
	// TODO: better markup
	let markup = '';
	// construct html for list
	for (let venueName in venues) {
		if (venues.hasOwnProperty(venueName)) {
			const venue = venues[venueName];
			markup += `
			<div class="venue p-2 m-1" style="background-color:rgba(0,0,0,0.5)">
				<h2>${venue.name}</h2>
				<p>${venue.address[0]}<br>
				${venue.address[1]}, ${venue.address[2]} ${venue.address[3]}</p>
				<ul>
					${venue.shows.map(showDivTemplate).join('')}
				</ul>
			</div>
			`
		}
	}
	// write html to dom
	listDiv.innerHTML = markup;

	// When a venue is clicked in the list
	$(".venue").on("click", function() {
		ascrollto("map");
		
		// Save the venue name clicked as a variable
		let thisVenueName = $(this)[0].childNodes[1].innerText;

		// Iterate over all the venue markers
		for (let i = 0; i < map.venueMarkerArray.length; i++) {
			// If th venue marker's venue name is the same as the venue name clicked
			if (map.venueMarkerArray[i].venueName === thisVenueName) {
				// Zooms to the venue
				map.display.flyTo(map.venueMarkerArray[i].venueMarker._latlng, 15);
				// Open the popup for the venue
				map.venueMarkerArray[i].venueMarker.openPopup();
			}
		}
	});
};