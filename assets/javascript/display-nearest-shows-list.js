"use strict";

const createShowList = shows =>
{
	const showDivTemplate = show =>`
	<div class="show p-2 m-1" style="background-color:rgba(0,0,0,0.5)"
		data-lat="${show.lat}" data-lng="${show.lng}">
		<h3>${show.artist}</h3> 
		<h4>${show.name}</h4>
		<h5>${show.date} ${show.time}</h5>
	</div>`;
	// construct html for list
	// write html to dom
	let listDiv = document.getElementById("list");
	listDiv.style = "overflow: scroll;";
	// TODO: better markup
	listDiv.innerHTML = shows.map(showDivTemplate).join('');
};