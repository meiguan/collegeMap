
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

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

  map.addSource('college-locations', {
    type: 'geojson',
    data: './data/nyColleges.geojson'
  });

  map.addLayer({
    'id': 'college-locations',
    'type': 'symbol',
    'source': 'college-locations',
    'layout': {
      'icon-image': 'college-15', //https://github.com/mapbox/mapbox-gl-styles change the icon to a different
      'icon-size': 1.5
    }
  });

  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted college
  map.addLayer({
    id: 'highlight-symbol',
    type: 'circle',
    source: 'highlight-college',
    paint: {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#66b3ff',
    }
  });

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mousemove', function (e) {
    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['college-locations'],
    });

    // if the mouse pointer is over a feature on our layer of interest
    // take the data for that feature and display it in the sidebar
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      var hoveredFeature = features[0]
      var featureInfo = `
        <h4>${hoveredFeature.properties.inst_name}</h4>
        <p><strong>HBCU:</strong> ${hoveredFeature.properties.hbcu}</p>
        <p><strong>Total Admitted:</strong> ${hoveredFeature.properties.total_admitted}</p>
      `
      $('#feature-info').html(featureInfo)

      // set this lot's polygon feature as the data for the highlight source
      map.getSource('highlight-college').setData(hoveredFeature.geometry);
    } else {
      // if there is no feature under the mouse, reset things:
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      });

      // reset the default message
      $('#feature-info').html(defaultText)
    }
  })
});

$(function() {
    var data = './data/nyColleges.geojson'
    $.each(data, function(i, option) {
        $('#sel').append($('<option/>').attr("value", option.features.unitid).text(option.features.inst_name));
    });
})
