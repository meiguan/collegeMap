// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.9647614, 40.8075395]
var initialZoom = 10

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  map.addSource('college-locations', {
    type: 'geojson',
    data: './data/nyColleges.geojson'
  });

  map.addLayer({
    'id': 'college-locations',
    'type': 'circle',
    'source': 'college-locations',
    paint: {
      'circle-radius': 8,
      'circle-opacity': .7,
      'circle-color': '#66b3ff',
    }
  });

  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-college', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted college
  map.addLayer({
    id: 'highlight-symbol',
    type: 'symbol',
    source: 'highlight-college',
    'layout': {
      'icon-image': 'college-15', //https://github.com/mapbox/mapbox-gl-styles change the icon to a different
      'icon-size': 0.8
    }

  });

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mousemove', function(e) {
    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['college-locations'],
    });

    // if the mouse pointer is over a feature on our layer of interest
    // take the data for that feature and display it in the sidebar
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer'; // make the cursor a pointer

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

let dropdown = $('#unitId');
dropdown.empty();
dropdown.append('<option selected="true" disabled>Choose A University</option>');
dropdown.prop('selectedIndex', 0);

$(function() {
  // use jQuery's getJSON() to load the data from the file
  $.getJSON('./data/nyColleges.geojson', function(data) {
    // iterate over the features in the geojson FeatureCollection
    data.features.forEach(function(feature) {
      // for each feature, create an option in the dropdown
      dropdown.append($('<a class="dropdown-item"></a>').attr("value", feature.properties.unitid).text(feature.properties.inst_name));
    })

    $('.dropdown-item').click(function() {
      console.log($(this).text());
      var collegeName = $(this).text(); //get the selected the college name
      $("#collegeNameText").val(collegeName) //display selected college name

      var matchingFeature = data.features.find(function(feature) {
        return feature.properties.inst_name.toString() === collegeName
      })

      // use the matching feature's geometry to center the map
      map.flyTo({
        center: matchingFeature.geometry.coordinates,
        zoom: 15,
      })

      var matchingFeatureInfo = `
        <h4>${matchingFeature.properties.inst_name}</h4>
        <p><strong>HBCU:</strong> ${matchingFeature.properties.hbcu}</p>
        <p><strong>Total Admitted:</strong> ${matchingFeature.properties.total_admitted}</p>
      `
      $('#feature-info').html(matchingFeatureInfo)

      var ctx2 = document.getElementById('collegeBarChart').getContext('2d');
      var chart2 = new Chart(ctx2, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
          labels: ['All institutions', 'Public', 'Private Non-Profit', 'Private For-Profit'],
          datasets: [{
            label: '% Completed',
            backgroundColor: '#1089ff',
            borderColor: '#1089ff',
            data: [60, 60, 66, 21]
          }]
        },

        // Configuration options go here
        options: {
          title: {
            display: true,
            text: 'Percent of Students Complete in 6-Years Time'
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Percent'
              },
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Type of Institution'
              }
            }]
          }
        }
      });

    })
  })
});

var ctx1 = document.getElementById('completersBarChart').getContext('2d');
var chart1 = new Chart(ctx1, {
  // The type of chart we want to create
  type: 'bar',

  // The data for our dataset
  data: {
    labels: ['All institutions', 'Public', 'Private Non-Profit', 'Private For-Profit'],
    datasets: [{
      label: '% Completed',
      backgroundColor: '#1089ff',
      borderColor: '#1089ff',
      data: [60, 60, 66, 21]
    }]
  },

  // Configuration options go here
  options: {
    title: {
      display: true,
      text: 'Percent of Students Complete in 6-Years Time'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Percent'
        },
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Type of Institution'
        }
      }]
    }
  }
});
