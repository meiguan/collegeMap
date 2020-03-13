// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.9968643,40.7060855]
var initialZoom = 8

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

var size = 200;

// implementation of CustomLayerInterface to draw a pulsing dot icon on the map
// see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // get rendering context for the map canvas when layer is added to the map
  onAdd: function() {
    var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
  },

  // called once before every frame where the icon will be used
  render: function() {
    var duration = 1000;
    var t = (performance.now() % duration) / duration;

    var radius = (size / 2) * 0.3;
    var outerRadius = (size / 2) * 0.7 * t + radius;
    var context = this.context;

    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = 'rgba(63, 127, 191,' + (1 - t) + ')';
    context.fill();

    // draw inner circle
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      radius,
      0,
      Math.PI * 2
    );
    context.fillStyle = 'rgba(63, 127, 191, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // update this image's data with data from the canvas
    this.data = context.getImageData(
      0,
      0,
      this.width,
      this.height
    ).data;

    // continuously repaint the map, resulting in the smooth animation of the dot
    map.triggerRepaint();

    // return `true` to let the map know that the image was updated
    return true;
  }
};

map.on('load', function() {
  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

  map.addSource('points', {
    'type': 'geojson',
    'data': 'data/nyColleges.geojson'
  });

  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
      'icon-image': 'pulsing-dot'
    }
  });
});
