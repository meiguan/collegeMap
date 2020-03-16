
// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.991780, 40.676]
var initialZoom = 6

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/dark-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

map.on('load', function () {

  map.addSource('colleges', {
    type: 'geojson',
    data: './data/nyColleges.geojson'
  });

  map.addLayer({
    'id': 'colleges',
    'type': 'symbol',
    'source': 'colleges',
    'layout': {
      'icon-image': 'college-15' //https://github.com/mapbox/mapbox-gl-styles change the icon to a different 
    }
  });
});
