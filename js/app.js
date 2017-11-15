let map;

class PoiData {
    constructor(title, location) {
        self = this;

        self.title = title;
        self.location = location;
        self.marker; // populated later when we have a marker
    }
}

class View {
}

class Model {
    constructor() {
        let self = this;

        self.poi = ko.observableArray([
            new PoiData('Spectrum Stadium', {lat: 28.608254, lng: -81.192621}),
            new PoiData('Computer Science Department', {lat: 28.60054, lng: -81.197614}),
            new PoiData('Limbitless Solutions', {lat: 28.60687, lng: -81.196695}),
            new PoiData('Central Florida Research Park', {lat: 28.587104, lng: -81.199559}),
            new PoiData('Lazy Moon', {lat: 28.598338, lng: -81.219712})
        ]);
    }
}

class ViewModel {
    constructor() {
        let self = this;

        self.model = new Model();
        self.view = new View();

        self.poiData = self.model.poi();
        self.poiMarkers = [];

        self.mapBounds = new google.maps.LatLngBounds();

        self.initMaps();
        self.createMarkers();
    }

    // ko calls this when a list item is cliked
    onClick(data, event) {
        google.maps.event.trigger(data.marker, 'click');
    }

    initMaps() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 28.602427, lng: -81.20006},
            zoom: 15
        });
    }

    createMarkers() {
        for (let x = 0; x < this.poiData.length; x++) {

            let poiLocation = this.poiData[x].location;
            let poiTitle = this.poiData[x].title;

            let poiMarker = new google.maps.Marker({
                map: map,
                position: poiLocation,
                title: poiTitle,
                animation: google.maps.Animation.DROP,
                id: x
            });

            this.poiData[x].marker = poiMarker;

            this.poiMarkers.push(poiMarker);

            let infoWindow = new google.maps.InfoWindow({
                content: this.poiMarkers[x].title
            });

            poiMarker.addListener('click', function () {
                infoWindow.open(map, poiMarker);
            });

            let point = new google.maps.LatLng(poiLocation.lat, poiLocation.lng);
            this.mapBounds.extend(point);
        }
    }
}

// callback from script load in html file
function runApp() {
    let viewModel = new ViewModel();
    ko.applyBindings(viewModel);
}

function handleError() {
    alert("Error loading maps");
}


