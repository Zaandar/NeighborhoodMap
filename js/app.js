let map;

class View{
}

class Model{
    constructor() {
        let self = this;

        self.poi = ko.observableArray([
            { id: 0, title: 'Spectrum Stadium', location: {lat: 28.608254, lng: -81.192621}},
            { id: 1, title: 'Computer Science Department', location: {lat: 28.60054, lng: -81.197614}},
            { id: 2, title: 'Limbitless Solutions', location: {lat: 28.60687, lng: -81.196695}},
            { id: 3, title: 'Central Florida Research Park', location: {lat: 28.587104, lng: -81.199559}},
            { id: 4, title: 'Lazy Moon', location: {lat: 28.598338, lng: -81.219712}},
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

    onClick(data, event){
        google.maps.event.trigger(poiMarkers[this.id], 'click');
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

function handleError(){
    alert("Error loading maps");
}


