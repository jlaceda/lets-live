map.addTileLayer();

navigator.geolocation.getCurrentPosition(function(location) {
    map.createCurrPosMarker(location);
    let showsArrayPromise = getNearestShows(location.coords.latitude, location.coords.longitude)
    showsArrayPromise.then(map.createVenueMarkers);
    showsArrayPromise.then(createShowList);
},
// error callback
error => console.warn(`ERROR(${error.code}): ${error.message}`));