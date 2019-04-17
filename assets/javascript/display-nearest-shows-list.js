"use strict";

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
};