var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.332525, lng: -0.076398},
        zoom: 12
    });
}

initMap();