import { PanelPlugin } from '@grafana/data';
import { SimpleOptions, MapViewInterface, LegendOptions, TopologyOptions, DataMappingOptions } from './types';
import { AtlasPanel } from './AtlasPanel';
import { TextPanelEditor } from 'editors/TextPanelEditor';
import { MapLayerEditor } from 'editors/MapLayerEditor';
import { MapViewEditor } from 'editors/MapViewEditor';
import { DataGroupEditor } from 'editors/DataGroupEditor';
import { LegendEditor } from 'editors/LegendEditor';
import { TopologyEditor } from 'editors/TopologyEditor';
import AtlasOptions from './config/AtlasOptions.js';
import pointHtml from './config/pointHtml.js';
import lineHtml from './config/lineHtml.js';
import { DataMappingEditor } from 'editors/DataMappingEditor';

let defaultCustomMap = '{"adjacencies":[],"endpoints":{},"metadata":{},"name":"New Map"}';

// ─────────────────────────────────────────────────────────────────────────────
//  FIX 3: Default map view — change lat/lng/zoom here to set where the map
//  opens by default.  Users can also override these live in the Grafana panel
//  editor under "Map Appearance → Starting Position" without touching code.
// ─────────────────────────────────────────────────────────────────────────────
let defaultMapView: MapViewInterface = {
  lat: '0',
  lng: '0',
  zoom: String(AtlasOptions.leaflet.minZoom) || '2',
  minZoom: AtlasOptions.leaflet.minZoom || 1,
  maxZoom: AtlasOptions.leaflet.maxZoom || 20,
};

let lineLegend = AtlasOptions.legend.legends.lines;
let defaultLegendOptions: LegendOptions = {
  display: false,
  orientation: AtlasOptions.legend.orientation,
  size: AtlasOptions.legend.size.substring(0, AtlasOptions.legend.size.length - 1),
  colors: lineLegend.colors,
  threshold: [lineLegend.min, ...lineLegend.thresholds, lineLegend.max],
  type: lineLegend.type,
  target: 'latest',
  textColor: 'black',
  unit: 'bps',
};

let defaultTopologyOptions: TopologyOptions = {
  point: {
    color: AtlasOptions.point.color,
    tooltip: {
      display: true,
      static: AtlasOptions.point.staticTooltip || false,
      custom: false,
      content: pointHtml,
    },
  },
  line: {
    color: AtlasOptions.line.color,
    aggregationType: 'max',
    tooltip: {
      display: true,
      custom: false,
      content: lineHtml,
    },
  },
};

let dataMappingDefaultOptions: DataMappingOptions = {
  dataTarget: 'chooseMax',
  dataAggregate: 'first',
  colorCriteria: 'now',
};

export const plugin = new PanelPlugin<SimpleOptions>(AtlasPanel).setPanelOptions((builder) => {
  return builder
    .addRadio({
      path: 'mapType',
      defaultValue: 'url',
      name: 'Map Source',
      settings: {
        options: [
          { value: 'custom', label: 'Custom' },
          { value: 'url',    label: 'URL'    },
        ],
      },
      category: ['Map Settings'],
    })
    .addCustomEditor({
      id: 'customMapJSON',
      path: 'customMapJSON',
      name: 'Custom Map',
      description: 'Edit map using the Atlas Editor or manually configure the JSON',
      defaultValue: { content: JSON.stringify(JSON.parse(defaultCustomMap), null, 2), mode: 'json' },
      editor: TextPanelEditor,
      showIf: (config) => config.mapType === 'custom',
      category: ['Map Settings'],
    })
    .addCustomEditor({
      id: 'mapURLs',
      path: 'mapURLs',
      name: 'Map URL',
      description: 'Add Map Name and a link to its JSON map',
      defaultValue: {},
      editor: MapLayerEditor,
      showIf: (config) => config.mapType === 'url',
      category: ['Map Settings'],
    })

    // ── Map Appearance ────────────────────────────────────────────────────
    // FIX 3: Three plain number/text inputs for starting position so users
    // can type exact coordinates directly in the Grafana panel editor.
    // These write into options.mapView.lat / .lng / .zoom which AtlasPanel
    // already reads in setMapView().  The existing MapViewEditor custom
    // editor is kept below for advanced users who prefer the visual widget.
    .addTextInput({
      path: 'mapView.lat',
      name: 'Starting Latitude',
      description: 'Latitude for the initial map centre (e.g. 39.5 for the US)',
      defaultValue: defaultMapView.lat,
      category: ['Map Appearance'],
    })
    .addTextInput({
      path: 'mapView.lng',
      name: 'Starting Longitude',
      description: 'Longitude for the initial map centre (e.g. -98.35 for the US)',
      defaultValue: defaultMapView.lng,
      category: ['Map Appearance'],
    })
    .addNumberInput({
      path: 'mapView.zoom',
      name: 'Starting Zoom Level',
      description: 'Initial zoom level (1 = world view, 10 = city level, 18 = street level)',
      defaultValue: parseFloat(defaultMapView.zoom),
      settings: {
        min: defaultMapView.minZoom,
        max: defaultMapView.maxZoom,
        step: 0.5,
      },
      category: ['Map Appearance'],
    })
    .addCustomEditor({
      id: 'mapView',
      path: 'mapView',
      name: 'Map View (advanced)',
      defaultValue: defaultMapView,
      description: 'Fine-grained map centre / zoom editor — use the inputs above for quick changes',
      editor: MapViewEditor,
      category: ['Map Appearance'],
    })
    .addBooleanSwitch({
      path: 'mapTile',
      defaultValue: false,
      name: 'Custom Map Tile',
      category: ['Map Appearance'],
    })
    .addTextInput({
      path: 'mapTileURL',
      defaultValue: '',
      name: 'Custom Map Tile URL',
      showIf: (config) => config.mapTile === true,
      category: ['Map Appearance'],
    })
    .addBooleanSwitch({
      path: 'weatherTile',
      defaultValue: false,
      name: 'Weather Tile',
      category: ['Map Appearance'],
    })
    .addBooleanSwitch({
      path: 'mapSelector',
      defaultValue: false,
      name: 'Individual Layer Selector',
      description: 'Allows user to toggle map layers from the dashboard view',
      category: ['Map Appearance'],
    })

    // ── Legend ─────────────────────────────────────────────────────────────
    .addCustomEditor({
      path: 'legend',
      defaultValue: defaultLegendOptions,
      id: 'legend',
      editor: LegendEditor,
      name: 'Legend Appearance',
      description: 'Edit/Update map legend configuration',
      category: ['Legend Options'],
    })

    // ── Topology ───────────────────────────────────────────────────────────
    .addCustomEditor({
      path: 'topology',
      defaultValue: defaultTopologyOptions,
      id: 'topology',
      editor: TopologyEditor,
      name: 'Topology Defaults',
      description: 'Edit/Update default values of topological layers.',
      category: ['Topology Options'],
    })

    // ── Data Settings ──────────────────────────────────────────────────────
    .addCustomEditor({
      id: 'dataAggregateGroups',
      path: 'dataAggregateGroups',
      name: 'Data Aggregate(s)',
      description: 'Map Incoming Data To Circuits. Please run the query again to see applied changes.',
      defaultValue: [],
      editor: DataGroupEditor,
      category: ['Data Settings'],
    })
    .addSelect({
      path: 'topology.line.aggregationType',
      name: 'Line Data Aggregation',
      description: 'Choose how to handle multiple data targets assigned to a single line.',
      defaultValue: 'max',
      settings: {
        options: [
          { value: 'max', label: 'Highest Value (Max)' },
          { value: 'avg', label: 'Average'             },
          { value: 'sum', label: 'Sum (Total)'         },
        ],
      },
      category: ['Data Settings'],
    })
    .addCustomEditor({
      id: 'dataMappings',
      path: 'dataMappings',
      name: 'Topology Coloring Options',
      description: '',
      defaultValue: dataMappingDefaultOptions,
      editor: DataMappingEditor,
      category: ['Data Settings'],
    });
});