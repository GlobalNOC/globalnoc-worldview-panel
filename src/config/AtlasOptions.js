import pointHtml from './pointHtml.js';
import lineHtml from './lineHtml.js';

const mapOptions = {
  debug: true,
  controls: {
    allLayers: true,
    zoomMin: true,
    editor: true,
  }
};

const legendOptions = {
  position: 'bottom-left',
  orientation: 'horizontal',
  size: '100%',
  legends: {
    lines: {
      type: 'percent',
      units: 'bps',
      min: 0,
      max: 100,
      thresholds: [1.9,    4.9,        11,       16.1,         33.6,      48.3,      69.2,     99],
      colors: ['#77BEFC',  '#A2FEAF', '#2BE690', '#FFE13B', '#F2A82A', '#FF5459', '#F20544', '#E846A5', '#bf70f9']
      
    },
  }

  // thresholds: [1.9,   3.2,       4.9,        7.4,       11,       16.1,       23.3,      33.6,      48.3,      69.2,     99],
  // colors: ['#77BEFC', '#37A1FB', '#A2FEAF', '#76F588', '#2BE690', '#FFE13B', '#F2D236', '#F2A82A', '#FF5459', '#F20544', '#E846A5', '#bf70f9']

      //      0------100mb--------250mb------500mb-------1gb--------2gb---------5gb-------10gb------20gb-------40gb-------80gb-------100gb-------400
      //      0------1.9--------3.2--------4.9--------7.4--------11---------16.1--------23.3------33.6-------48.3-------69.2-------99----------100
  
};

const leafletOptions = {
  minZoom: 2,
  maxZoom: 20,
  attributionControl: false,
  zoomControl: true,
  zoomSnap: 0.5,
  zoomDelta: 1,
  boxZoom: true,
  doubleClickZoom: true,
  dragging: true,
  scrollWheelZoom: true,
  updateWhenZooming: false,
  updateWhenIdle: true,
};

  const tileOptions = [
    {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      default: true,
      name: 'map'
    }

]

const overlayTileOptions = [
  {
    name: 'weather',
    url: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png',
    maxZoom: 20,
    attribution: 'Nope',
    id: 'mesonet',
  }
]

const overlayTopologyOptions = {

}

const topologyOptions = {
  twins: false,
};

const pointOptions = {
  size: 3,
  shape: 'circle',
  color: 'rgba(40, 40, 40, 1)',
  stroke: 1,
  fill: 'rgba(40, 40, 40, 1)',
  fillOpacity: 1
}

const lineOptions = {
  dataTarget: 'chooseMax',
  dataAggregate: 'first',
  colorCriteria: 'now',
  weight: 3,
  opacity: 1,
  smoothFactor: 1,
  color: 'rgba(120, 120, 120, 0.5)',
};

const tooltipOptions = {
  autoPan: false,
  line: {
    html: lineHtml,
    vars: {
      test: 'This is a test string for lines',
    },
  },
  point: {
    html: pointHtml,
    vars: {
      test: 'This is a test string for points',
    }
  }
}

let testOptions = {
  map: mapOptions,
  legend: legendOptions,
  leaflet: leafletOptions,
  tiles: tileOptions,
  topology: topologyOptions,
  point: pointOptions,
  line: lineOptions,
  tooltip: tooltipOptions,
  overlayTiles: overlayTileOptions,
  overlayTopology: overlayTopologyOptions
};

export default testOptions
