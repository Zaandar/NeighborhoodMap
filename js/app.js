let map;

class ViewModel {


    // firstName: "Bert",
    // lastName: "Bertington",

    constructor() {
        this.initMaps();
        this.createMarkers();
    }

    initMaps() {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 28.602427, lng: -81.20006},
            zoom: 15
        });
    }

    createMarkers() {
        let poi = [
            {title: 'Spectrum Stadium', location: {lat: 28.608254, lng: -81.192621}},
            {title: 'Computer Science Department', location: {lat: 28.60054, lng: -81.197614}},
            {title: 'Limbitless Solutions', location: {lat: 28.60687, lng: -81.196695}},
            {title: 'Central Florida Research Park', location: {lat: 28.587104, lng: -81.199559}},
            {title: 'Lazy Moon', location: {lat: 28.598338, lng: -81.219712}},
        ];

        let poiMarkers = [];

        for (let x = 0; x < poi.length; x++) {

            let poiLocation = poi[x].location;
            let poiTitle = poi[x].title;

            let poiMarker = new google.maps.Marker({
                map: map,
                position: poiLocation,
                title: poiTitle,
                animation: google.maps.Animation.DROP,
                id: x
            });

            poiMarkers.push(poiMarker);

            let infoWindow = new google.maps.InfoWindow({
                content: poiMarkers[x].title
            });

            poiMarker.addListener('click', function () {
                infoWindow.open(map, poiMarker);
            });

            let mapBounds = new google.maps.LatLngBounds();
            mapBounds.extend((poiMarkers[x]).position);
        }
    }
}

// callback from script load in html file
function startApp() {
    ko.applyBindings(new ViewModel());
}
