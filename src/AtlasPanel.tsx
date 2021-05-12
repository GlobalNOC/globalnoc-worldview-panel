import React, { Component } from 'react';
import { PanelProps, SelectableValue, urlUtil } from '@grafana/data';
import { SimpleOptions, CircuitDataType } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { DataUtil } from './util/DataUtil';
import { Select, Icon } from '@grafana/ui';
import { cx } from 'emotion';
import { getMapSelectorTheme } from './util/MapSelector';
import AtlasOptions from './config/AtlasOptions.js';
import Atlas from './lib/Atlas4.js';
import { config } from '@grafana/runtime';

interface Props extends PanelProps<SimpleOptions> {}

interface AtlasPanelState {
  mapID: string;
  mapWrapperID: string;
  atlas: any;
  mapSelectorDisplay: boolean;
}

interface FetchSession {
  [key: string]: string;
}

interface DataDictionary {
  [key: string]: {
    // Node Name
    [key: string]: {
      // Interface Name
      input?: CircuitDataType[];
      output?: CircuitDataType[];
    };
  };
}

let editFromPanel = false;
let fetchSession: FetchSession = {};
let mapUpdated = false;
let lastDataDictionaryCreated = '';
let dataDictionary: DataDictionary = {};
let styles = getMapSelectorTheme(config.theme);

export class AtlasPanel extends Component<Props, AtlasPanelState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mapID: 'a' + uuidv4(),
      mapWrapperID: 'b' + uuidv4(),
      atlas: undefined,
      mapSelectorDisplay: false,
    };
    this.setLayerDisplay = this.setLayerDisplay.bind(this);
  }

  componentDidMount() {
    let atlas = new Atlas(this.state.mapID, AtlasOptions);
    this.setState({ atlas }, () => {
      this.atlasInitialized();
      this.configureAtlasEditorDisplay();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only re fetch maps if map settings arfe edited
    if (
      nextProps.options.mapType !== this.props.options.mapType ||
      JSON.stringify(nextProps.options.mapURLs) !== JSON.stringify(this.props.options.mapURLs)
    ) {
      mapUpdated = true;
    }

    return true;
  }

  componentDidUpdate() {
    this.configureAtlasEditorDisplay();
    if (editFromPanel) {
      editFromPanel = false;
      return;
    }
    if (mapUpdated) {
      this.setMapFromOptions();
    } else {
      mapUpdated = false;
    }

    this.setMapView();
    this.setMapTile();
    this.setWeatherTile();
    this.setLegendConfiguration();
    this.setTopologyOptions();
    this.setTopologyData();
  }

  atlasInitialized() {
    this.setListeners();
    this.setMapFromOptions();
    this.setMapView();
    this.setMapTile();
    this.setWeatherTile();
    this.setLegendConfiguration();
    this.setTopologyData();
  }

  setListeners() {
    this.setUpdateListeners();
    this.setMapViewUpdateListeners();
    this.setTopologyUpdateListeners();
  }

  setMapViewUpdateListeners() {
    let { atlas } = this.state;
    atlas.map.on('moveend dragend', () => {
      let center = atlas.map.getCenter();

      let mapView = { ...this.props.options.mapView };
      mapView.lat = center.lat.toFixed(4);
      mapView.lng = center.lng.toFixed(4);
      mapView.zoom = atlas.map.getZoom();
      editFromPanel = true;
      this.props.onOptionsChange({
        ...this.props.options,
        mapView,
      });
    });
  }

  setUpdateListeners() {
    let { atlas } = this.state;
    atlas.on('update', () => {
      let { mapType } = this.props.options;
      let json = atlas.getJSON();
      let options = this.props.options;
      options.customMapJSON = { content: JSON.stringify(json[0], null, 2), mode: 'json' };
      editFromPanel = true;
      if (mapType === 'custom') {
        this.props.onOptionsChange({ ...options });
      }
    });
  }

  setMapFromOptions() {
    let { mapType } = this.props.options;
    if (mapType === 'custom') {
      this.setCustomMap();
    } else {
      this.setURLMap();
    }
  }

  setURLMap() {
    let { atlas } = this.state;
    let { mapURLs } = this.props.options;
    let { lat, lng } = this.props.options.mapView;
    let reinforceView = this.reinforceView.bind(this);
    let setData = this.setTopologyData.bind(this);
    atlas.editor.disableAllModes();

    if (atlas.editor.sidebar.sbContainer) {
      atlas.editor.hideToolbar();
      atlas.editor.hideSidebar();
    }

    atlas.removeAllTopologies();

    for (const id in mapURLs) {
      let sessionID = uuidv4();
      fetchSession[mapURLs[id].url] = sessionID;
      fetchMaps(mapURLs[id], sessionID);
    }

    async function fetchMaps(mapURL, sessionID) {
      let { url, name, display } = mapURL;
      if (url === '') {
        return;
      }
      try {
        const request = await fetch(url);
        const atlasObj = await request.json();
        if (sessionID === fetchSession[url]) {
          for (const map of atlasObj) {
            map.metadata.mb_url = url;
            map.metadata.grafana_alias = name;
            atlas.addTopology(map);

            setData();
            if (!display) {
              atlas.hideTopology(map.name);
            }
            reinforceView(lat, lng);
          }
        } else {
          console.log('Bailing This Request');
        }
      } catch (error) {}
    }
  }

  // Leaflet Bug
  reinforceView(lat, lng) {
    let { atlas } = this.state;
    atlas.map.setView({ lat, lng });
  }

  setCustomMap() {
    let { atlas } = this.state;
    let { customMapJSON } = this.props.options;
    let topology;
    let reinforceView = this.reinforceView.bind(this);
    let setData = this.setTopologyData.bind(this);
    let { lat, lng } = this.props.options.mapView;
    try {
      topology = JSON.parse(customMapJSON.content);
    } catch (e) {
      console.error('Unable to parse JSON data from Panel Options Editor');
    }

    if (topology) {
      // Disable Atlas Editor
      atlas.editor.disableAllModes();
      if (atlas.editor.sidebar.sbContainer) {
        atlas.editor.hideToolbar();
        atlas.editor.hideSidebar();
      }

      // Remove all existing topologies and add new one
      atlas.removeAllTopologies();
      atlas.addTopology(topology);
      setData();
      // if (!display) {
      //   atlas.hideTopology(map.name);
      // }
      reinforceView(lat, lng);
    }
  }

  setMapView() {
    let { atlas } = this.state;
    let { lat, lng, zoom } = this.props.options.mapView;

    atlas.map.setZoom(zoom);

    const setViewAfterZoom = () => {
      atlas.map.setView({ lat, lng });
    };

    atlas.map.on('zoomend', setViewAfterZoom);

    const moveEndListener = () => {
      atlas.map.off('zoomend', setViewAfterZoom);
      atlas.map.off('moveend', moveEndListener);
    };

    atlas.map.on('moveend', moveEndListener);
  }

  setMapTile() {
    let { atlas } = this.state;
    let { mapTile } = this.props.options;
    atlas.showTile(mapTile);
  }

  setWeatherTile() {
    let { atlas } = this.state;
    let { weatherTile } = this.props.options;
    if (weatherTile) {
      atlas.showOverlayTile('weather');
      atlas.redrawOverlayTiles();
    } else {
      atlas.hideOverlayTile('weather');
    }
  }

  setLegendConfiguration() {
    let { atlas } = this.state;
    let { legend } = this.props.options;

    if (legend.display) {
      atlas.legends.lines.show();
      atlas.changeLegendProperty('lines', 'orientation', legend.orientation);
      atlas.changeLegendProperty('lines', 'size', legend.size + '%');
      atlas.changeLegendProperty('lines', 'type', legend.type);
      atlas.changeLegendValues('lines', legend.threshold, legend.colors);

      let labelBar = atlas.legends.lines.labelBar as HTMLDivElement;
      let labels = Array.from(labelBar.children) as HTMLDivElement[];
      for (const label of labels) {
        label.style.color = legend.textColor;
      }
    } else {
      atlas.legends.lines.hide();
    }
  }

  setTopologyUpdateListeners() {
    let { atlas } = this.state;

    atlas.on('topology-added', () => {
      this.setTopologyHelper();
    });
  }

  setTopologyOptions() {
    this.setTopologyHelper();
  }

  setTopologyHelper() {
    let { atlas } = this.state;
    let topologyOptions = this.props.options.topology;

    for (const t in atlas.topologies) {
      let topology = atlas.topologies[t];

      topology.points.forEach(p => {
        p.color = topologyOptions.point.color;
        p.fill = topologyOptions.point.color;

        let display = topologyOptions.point.tooltip.display;
        let staticTooltip = topologyOptions.point.tooltip.static;

        if (display) {
          p.tooltip.html = topologyOptions.point.tooltip.content;
          p.tooltip.update('html');
        }

        if (display && staticTooltip) {
          p.makeStatic(true);
        } else {
          p.makeStatic(false);
        }

        if (display) {
          p.showToolTip();
        } else {
          p.hideToolTip();
        }

        p.update();
      });

      topology.lines.forEach(l => {
        l.options.color = topologyOptions.line.color;
        let display = topologyOptions.line.tooltip.display;

        if (display) {
          l.tooltip.html = topologyOptions.line.tooltip.content;
          l.tooltip.update('data');
        }

        if (display) {
          l.showToolTip();
        } else {
          l.hideToolTip();
        }

        try {
          l.update('style');
        } catch (error) {}
      });
    }
  }

  setTopologyData() {
    let { data } = this.props;

    // Only create a new data dictionary if data is fetched again
    if (data.state === 'Done' && lastDataDictionaryCreated !== data.request!.requestId) {
      this.createDataDictionary();
    }

    this.addDataToCircuits();
  }

  addDataToCircuits() {
    let { topologies } = this.state.atlas;
    let aggregateMetric = this.props.options.legend.target;

    for (const topologyName in topologies) {
      let { lines } = topologies[topologyName];

      for (const line of lines) {
        if (!line.metadata?.targets) {
          continue;
        }
        let values: CircuitDataType[][] = [];
        for (const target of line.metadata.targets) {
          let node = target.node_name;
          let intf = target.interface_name;
          if (dataDictionary[node] && dataDictionary[node][intf]) {
            if (dataDictionary[node][intf].input) {
              values.push(dataDictionary[node][intf].input!);
            }
            if (dataDictionary[node][intf].output) {
              values.push(dataDictionary[node][intf].output!);
            }
          }
        }

        let [inputAggregate, outputAggregate] = DataUtil.aggregateData(values, aggregateMetric);

        if (inputAggregate) {
          let dataObj = {
            label: line.data.label,
            input: { now: inputAggregate },
            output: { now: outputAggregate },
          };
          if (line.metadata) {
            dataObj = {
              ...dataObj,
              ...line.metadata,
            };
          }
          line.set('data', dataObj);
        }
      }
    }
  }

  createDataDictionary() {
    let { series, request } = this.props.data;
    lastDataDictionaryCreated = request!.requestId;
    dataDictionary = {};
    for (const data of series) {
      try {
        let [node, intf, altIntf, value] = data.name!.split('+');
        let values = data.fields[1].values['buffer'];
        if (!dataDictionary[node]) {
          dataDictionary[node] = {};
        }
        if (!dataDictionary[node][intf]) {
          dataDictionary[node][intf] = {};
        }
        dataDictionary[node][intf][value] = values;
        if (intf !== altIntf) {
          if (!dataDictionary[node][altIntf]) {
            dataDictionary[node][altIntf] = {};
          }
          dataDictionary[node][altIntf][value] = values;
        }
      } catch (error) {
        dataDictionary = {};
        return;
      }
    }
  }

  getMapSelectorClass(): string[] {
    let classes: string[] = [];

    if (!this.props.options.mapSelector || this.props.options.mapType === 'custom') {
      classes.push(cx(styles.mapSelectorHide));
    }

    classes.push(cx(styles.mapSelectorContainer));

    if (!this.state.mapSelectorDisplay) {
      classes.push(cx(styles.mapSelectorCollapsed));
    }

    return classes;
  }

  getAllMapLayers() {
    let { atlas } = this.state;
    if (atlas) {
      let topologies = Object.keys(atlas.topologies);

      let options = topologies.map(topologyName => {
        let topology = atlas.topologies[topologyName];
        let derivedName = topology.metadata?.grafana_alias || topology.name;
        return { label: derivedName, value: derivedName };
      });

      return options;
    }
    return [];
  }

  getSelectedMapLayers() {
    let { mapURLs } = this.props.options;
    let selectedlayers: any[] = [];
    for (const id in mapURLs) {
      let { display, name } = mapURLs[id];
      if (display) {
        selectedlayers.push({ label: name, value: name });
      }
    }
    return selectedlayers;
  }

  setLayerDisplay(selectedValues: SelectableValue<string>) {
    let { atlas } = this.state;
    let { onOptionsChange } = this.props;
    let { mapURLs } = this.props.options;

    let topologyNames = Object.keys(atlas.topologies);
    let selectedTopologies = selectedValues.map(val => val.value);

    topologyNames.forEach(name => atlas.hideTopology(name));

    selectedTopologies.forEach(name => {
      let topologies = atlas.topologies;

      for (const topologyName in topologies) {
        let topology = topologies[topologyName];
        if (name === topology.name || name === topology.metadata?.grafana_alias) {
          atlas.showTopology(topologyName);
        }
      }
    });

    for (const id in mapURLs) {
      let layer = mapURLs[id];
      if (selectedTopologies.includes(layer.name)) {
        layer.display = true;
      } else {
        layer.display = false;
      }
    }

    onOptionsChange({ ...this.props.options });
  }

  configureAtlasEditorDisplay() {
    let { atlas, mapID } = this.state;
    // If edit mode is off turn off editor and remove all editing tool buttons
    // Make them visible when back in edit mode
    const params = urlUtil.getUrlSearchParams();
    if (params.editPanel != null && atlas) {
      let control = document.querySelector(`#${mapID} .leaflet-control-zoom`) as HTMLDivElement;
      control.style.display = '';
    } else if (atlas) {
      let control = document.querySelector(`#${mapID} .leaflet-control-zoom`) as HTMLDivElement;
      control.style.display = 'none';

      atlas.editor.disableAllModes();
      if (atlas.editor.sidebar.sbContainer) {
        atlas.editor.hideToolbar();
        atlas.editor.hideSidebar();
      }
    }
  }

  render() {
    return (
      <div
        id={this.state.mapWrapperID}
        style={{ position: 'relative', overflow: 'hidden', height: this.props.height, width: this.props.width }}
      >
        <div id={this.state.mapID} style={{ height: '100%' }}></div>
        <div className={this.getMapSelectorClass().join(' ')}>
          <div className={cx(styles.slectorWrapper)}>
            <span className={cx(styles.layerName)}>Maps</span>
            <Select
              onChange={e => {
                this.setLayerDisplay(e);
              }}
              isMulti={true}
              options={this.getAllMapLayers()}
              value={this.getSelectedMapLayers()}
            />
          </div>
          <div
            className={cx(styles.toggleMapSelectorArea)}
            onClick={e =>
              this.setState(s => {
                return { mapSelectorDisplay: !s.mapSelectorDisplay };
              })
            }
          >
            <Icon name={this.state.mapSelectorDisplay ? 'angle-up' : 'angle-down'} size="lg" />
          </div>
        </div>
      </div>
    );
  }
}
