/*
 * @author Wendy Robins
 */
window.onload = init;

var latitude, longitude;
var currLatitude, currLongitude;
var counter = 0;
var map = null;  // Google map
var path = [];  // Path
var lastMarker = null;


// REGISTER EVENT HANDLER FOR START BUTTON
function init() {

    var startButton = document.getElementById("startButton");
    startButton.onclick = getLocation;

    // DISABLE THE START BUTTON
    //document.getElementById("startButton").disabled = true;

}


// GET LOCATION
function getLocation() {

    // asynchronous call with callback success,
    // error functions and options specified
    var options = {
        enableHighAccuracy: true,   // get result as close to the user location as possible
        timeout: 50000,             // timeout within 50 seconds (50000 milliseconds)
        maximumAge: 0               // will not cache at 0
    };

    // asynchronous call on the navigator geolocation getCurrentPosition.
    navigator.geolocation.getCurrentPosition(displayLocation, handleError, options);

}


// DISPLAY LOCATION when results are available from getCurrentPosition
function displayLocation(position) {

    // DISABLE THE START BUTTON
    document.getElementById("startButton").disabled = true;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    currLatitude = latitude;
    currLongitude = longitude;

    counter++;

    //DISPLAY HTML
    document.getElementById("counter").innerHTML = "Update#: " + counter;
    document.getElementById("latitude").innerHTML = "Latitude: " + latitude;
    document.getElementById("longitude").innerHTML = "Longitude: " + longitude;
    document.getElementById("currLatitude").innerHTML = "Current Latitude: " + currLatitude;
    document.getElementById("currLongitude").innerHTML = "Current Longitude: " + currLongitude;

    // SHOW GOOGLE MAP WITH THE STARTING POSITION
    showOnMap(position.coords);

    // UPDATE MY LOCATION EVERY 5 SECONDS, which equals 5000 milliseconds)
    setInterval(updateMyLocation, 5000);

}


function updateMyLocation(data) {

    // Random numbers to represent change in latitude and longitude
    // Using Math.random()/100
    currLatitude = latitude + Math.random()/100;
    currLongitude = longitude - Math.random()/100;

    counter++

    // UPDATE CURRENT LOCATION IN THE HTML
    document.getElementById("counter").innerHTML = "Update#: " + counter;
    document.getElementById("currLatitude").innerHTML = "Current Latitude: " + currLatitude;
    document.getElementById("currLongitude").innerHTML = "Current Longitude: " + currLongitude;

    // SHOW GOOGLE MAP WITH THE CURRENT POSITION
    showSamplePath();
    navigator.geolocation.getCurrentPosition(displayLocation, handleError, options);

}

// CALLBACK FUNCTION ON ERROR
function handleError(error) {
    switch(error.code) {
        case 1:
            updateStatus("The user denied permission");
            break;
        case 2:
            updateStatus("Position is unavailable");
            break;
        case 3:
            updateStatus("Timed out");
            break;
    }
}


function updateStatus(message) {
    document.getElementById("status").innerHTML =
        "<strong>Error</strong>: " + message;
}

// INITIALIZE THE MAP AND SHOW THE POSITION
function showOnMap(pos) {

    //new position latitude and longitude
    var googlePosition =
        new google.maps.LatLng(pos.latitude, pos.longitude);

    //map options
    var mapOptions = {
        zoom: 17,   // zoom level
        center: googlePosition,     // map should be centered position
        mapTypeId: google.maps.MapTypeId.ROADMAP    // type of map to display to user
    };

    // CREATE NEW MAP OBJECT using Google map object. Identify DOM element
    var mapElement = document.getElementById("map");
    map = new google.maps.Map(mapElement, mapOptions);  //(DOM element, google map options)

    // ADD MARKER TO THE MAP
    var title = "Location Details";
    var content = "Lat: " + pos.latitude + ", Long: " + pos.longitude;
    addMarker(
        map,            // new map object
        googlePosition, // googlePosition at which the marker is to be added
        title,          // location details
        content);       // what will pop up when user clicks on it
}

// ADD POSITION MARKER TO THE MAP
function addMarker(map, latlongPosition, title, content) {

    var options = {
        position: latlongPosition,  //  where the marker should be placed
        map: map,
        title: title,       // title associated with marker
        clickable: true     // indicate whether it's clickable or not
    };
    var marker = new google.maps.Marker(options);   //

    var popupWindowOptions = {
        content: content,
        position: latlongPosition
    };

    var popupWindow = new google.maps.InfoWindow(popupWindowOptions);

    //  Event listener to open to show to the user
    google.maps.event.addListener(marker, 'click', function() {
        popupWindow.open(map);
    });
}

function showSamplePath() {
    path = [];

    // FIRST POINT
    var latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);

    //adjust latitude and longitude
    latitude += Math.random() / 100;
    longitude -= Math.random() / 100;

    // NEXT POINT on map adding the adjusted latitude and longitude
    latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);


    var line = new google.maps.Polyline({
        path : path,
        strokeColor : '#0000ff',
        strokeOpacity : 1.0,
        strokeWeight : 3
    });
    line.setMap(map);

    map.panTo(latlong);

    if (lastMarker)
        lastMarker.setMap(null);

    // ADD NEW MARKER
    lastMarker = addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}



























