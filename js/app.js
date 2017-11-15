let map;

// holds the data for a point of interest
class PoiData {
    constructor(title, location) {
        self = this;

        self.title = title;
        self.location = location;
        self.marker; // populated later when we have a marker
    }
}

// the application view
class View {
}

// the application data model
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

// the application view model
class ViewModel {

    constructor() {
        let self = this;

        self.model = new Model();
        self.view = new View();

        self.poiData = self.model.poi();
        self.poiMarkers = [];

        self.initMaps();
        self.createMarkers();
    }

    // ko calls this when a list item is clicked
    onClick(data, event) {
        data.marker.setAnimation(google.maps.Animation.BOUNCE);
        google.maps.event.trigger(data.marker, 'click');

        // stop the bouncing markers
        setTimeout(function () {
            data.marker.setAnimation(null);
        }, 1400);
    }

    // display the map
    initMaps() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 28.602427, lng: -81.20006},
            zoom: 14
        });
    }

    // build and display a list of markers based on the poi list
    createMarkers() {
        for (let x = 0; x < this.poiData.length; x++) {

            // create a marker
            let poiMarker = new google.maps.Marker({
                map: map,
                position: this.poiData[x].location,
                title: this.poiData[x].title,
                animation: google.maps.Animation.DROP,
                id: x
            });

            // assign a marker to each point of interest
            this.poiData[x].marker = poiMarker;

            // add the marker to the marker array
            this.poiMarkers.push(poiMarker);

            // create an info window for the marker
            let infoWindow = new google.maps.InfoWindow();


            // set a listener for clicks and display the info window
            poiMarker.addListener('click', function () {
                if (openWindow){
                    openWindow.close();
                }

                infoWindow.open(map, poiMarker);
                infoWindow.setContent(poiMarker.title);
                
                openWindow = infoWindow;
            });

            infoWindow.addListener('closeclick',function(){
                // infoWindow.setMarker = null;
                openWindow = null;
            });
        }
    }
}


let openWindow = null;

function runApp()
{
    let viewModel = new ViewModel();
    ko.applyBindings(viewModel);
}

function handleError()
{
    alert("Error loading maps");
}


