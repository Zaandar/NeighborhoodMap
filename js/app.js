let map;

// holds the data for a point of interest
class PoiData {
    constructor(title, location) {
        self = this;

        self.title = title;
        self.location = new google.maps.LatLng(location.lat, location.lng);
        self.marker; // populated later when we have a marker
    }
}

// the application data model
class Model {
    constructor() {
        let self = this;

        self.poi = ko.observableArray([
            new PoiData('Spectrum Stadium',
                {lat: 28.608254, lng: -81.192621}),
            new PoiData('University of Central Florida College of Engineering and Computer Science',
                {lat: 28.60054, lng: -81.197614}),
            new PoiData('Limbitless Solutions',
                {lat: 28.60687, lng: -81.196695}),
            new PoiData('Central Florida Research Park',
                {lat: 28.587104, lng: -81.199559}),
            new PoiData('Arboretum of the University of Central Florida',
                {lat: 28.600866, lng: -81.196438})
        ]);
    }
}

// the application view model
class ViewModel {

    constructor() {
        let self = this;

        self.model = new Model();

        self.poiData = self.model.poi();
        self.poiMarkers = [];
        self.filterText = ko.observable("");

        self.initMaps();
        self.createMarkers();

        // Thanks to http://www.knockmeout.net for the tutorial
        self.filteredPoiMarkers = ko.computed(function () {
            var filter = self.filterText().toLowerCase();

            // if no filter, return the original array
            if (!filter) {
                self.poiMarkers.forEach(function(item){
                    item.setVisible(true);
                });
                return self.poiMarkers;
            }
            else {
                // return the filtered array
                return ko.utils.arrayFilter(self.poiData, function (item) {
                    let match = self.stringStartsWith(item.title.toLowerCase(), filter);

                    // set marker to visible depending on whether or not
                    // it matches the filter
                    item.marker.setVisible(match);

                    // close any open infoWindow
                    if (!match  && (infoWindow.getPosition() === item.location)) {
                        infoWindow.close();
                        openWindow = null;
                    }

                    return match;
                });
            }
        });
    }

    // courtesy of knockout.js
    // returns true or false
    stringStartsWith(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    }

    // ko calls this when a list item is clicked
    onClick(data, event) {

        data.setAnimation(google.maps.Animation.BOUNCE);
        google.maps.event.trigger(data, 'click');

        // stop the bouncing markers
        setTimeout(function () {
            data.setAnimation(null);
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
            infoWindow = new google.maps.InfoWindow();

            // set a listener for clicks and display the info window
            poiMarker.addListener('click', function () {

                // if there is an open infoWindow, close it
                if (openWindow) {
                    openWindow.close();
                }

                $.ajax({
                    url: "https://en.wikipedia.org/w/api.php?action=opensearch&search="+poiMarker.title+"&limit=1",
                    dataType: 'jsonp',
                    success: function(data){
                        infoWindow.setContent(formatWikiResults(data));
                        infoWindow.open(map, poiMarker);
                    }
                });

                // set the currently open infoWindow so we
                // can close it if another marker is clicked
                openWindow = infoWindow;
            });

            // if the infoWindow is closed manually, set the
            // currently open window to null
            infoWindow.addListener('closeclick', function () {
                openWindow = null;
            });
        }
    }
}

// global
let openWindow = null;
let infoWindow;

function runApp() {
    let viewModel = new ViewModel();
    ko.applyBindings(viewModel);
}

function handleError() {
    alert("Error loading maps");
}

function formatWikiResults(results){
    let info = "";

    if (results[1] != null) {
        info += '<p><strong>' + results[1] + '</strong></p>';
    }

    if (results[2] != null) {
        info += '<p>' + results[2] + '</p>';
    }

    if (results[3] != null) {
        info += '<a href="' + results[3] + '"target="_blank">' + results[3] + '</a>';
    }

    return info;
}


