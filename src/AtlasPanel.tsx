import React, { Component } from 'react';
import { PanelProps, SelectableValue, urlUtil } from '@grafana/data';
import { SimpleOptions } from 'types';
import { v4 as uuidv4 } from 'uuid';
// import { DataUtil } from './util/DataUtil';
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

interface DataValue {
  aggregate_group: string;
  data_target: string;
  values: Array<[number, number]>;
}

let editFromPanel = false;
let fetchSession: FetchSession = {};
let mapUpdated = false;
let lastDataDictionaryCreated = '';
let dataValues: DataValue[] = [];
// let dataDictionary: DataDictionary = {};
// @ts-ignore
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
    // Refresh Leaflet Container whenever component is rerendered
    // Rerender will happen whenever the hieght/width of container is resized
    if (this.state.atlas) {
      this.state.atlas.map.invalidateSize();
    }
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

    let editorButton = document.querySelector('.atlas-toggle-editor') as HTMLAnchorElement;
    editorButton.style.display = 'none';
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

    let editorButton = document.querySelector('.atlas-toggle-editor') as HTMLAnchorElement;
    editorButton.style.display = '';
    if (topology) {
      // Disable Atlas Editor
      atlas.editor.disableAllModes();
      if (atlas.editor.sidebar.sbContainer) {
        atlas.editor.hideToolbar();
        atlas.editor.hideSidebar();
      }

      // Remove all existing topologies and add new one
      atlas.removeAllTopologies();
      console.log(topology);
      if (Array.isArray(topology)) {
        for (const topo of topology) {
          atlas.addTopology(topo);
        }
      } else {
        atlas.addTopology(topology);
      }

      try {
        setData();
      } catch (error) {
        console.log('Could not set data :(');
      }

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
    let { mapTile, mapTileURL } = this.props.options;

    if (!mapTileURL) {
      mapTileURL = '';
    }

    if (mapTile) {
      atlas.addTile({
        url: mapTileURL,
        maxZoom: 20,
        name: 'custom',
      });
    }

    mapTile ? atlas.showTile('custom') : atlas.showTile('map');
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

    atlas.changeLegendProperty('lines', 'type', legend.type);
    atlas.changeLegendValues('lines', legend.threshold, legend.colors);

    if (legend.display) {
      atlas.legends.lines.show();
      atlas.changeLegendProperty('lines', 'orientation', legend.orientation);
      atlas.changeLegendProperty('lines', 'size', legend.size + '%');

      let labelBar = atlas.legends.lines.labelBar as HTMLDivElement;
      let labels = Array.from(labelBar.children) as HTMLDivElement[];
      for (const label of labels) {
        label.style.color = legend.textColor;
      }
    } else {
      atlas.legends.lines.hide();
    }
  }

  setDataMappingOptions() {
    let { dataMappings } = this.props.options;
    let { atlas } = this.state;

    for (const property in dataMappings) {
      atlas.changeCircuitColoringProperties(property, dataMappings[property]);
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

      topology.points.forEach((p) => {
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

      topology.lines.forEach((l) => {
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
    console.log('DATA', data);
    // Only create a new data dictionary if data is fetched again
    if (data.state === 'Done' && lastDataDictionaryCreated !== data.request!.requestId) {
      this.createDataDictionary();
    }

    this.addDataToCircuits();
  }

  addDataToCircuits() {
    this.state.atlas.applyData(dataValues);
    this.setDataMappingOptions();
  }

  createDataDictionary() {
    let { series, request } = this.props.data;
    lastDataDictionaryCreated = request!.requestId;
    dataValues = [];

    let data_aggregates = this.props.options.dataAggregateGroups;

    if (data_aggregates.length === 0) {
      data_aggregates.push({
        aggregate_group: 'data',
        pattern: '.*',
      });
    }

    for (const data of series) {
      try {
        let data_target: string = data.name!;
        let speeds = data.fields[1].values.toArray().reverse() as number[];
        let timestamps = data.fields[0].values.toArray().reverse() as number[];

        let values: Array<[number, number]> = [];

        for (let i = 0; i < speeds.length; i++) {
          const speed = speeds[i];
          const time = timestamps[i];
          values.push([time, speed]);
        }

        let aggregate_group: string | undefined;

        for (const aggregates of data_aggregates) {
          if (!aggregates.pattern) {
            continue;
          }
          let regex = new RegExp(aggregates.pattern);
          if (regex.test(data_target)) {
            aggregate_group = aggregates.aggregate_group;
            break;
          }
        }

        if (aggregate_group) {
          dataValues.push({
            data_target,
            values,
            aggregate_group,
          });
        }
      } catch (error) {
        dataValues = [];
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

      let options = topologies.map((topologyName) => {
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
    let selectedTopologies = selectedValues.map((val) => val.value);

    topologyNames.forEach((name) => atlas.hideTopology(name));

    selectedTopologies.forEach((name) => {
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

    /* 
    TODO: Maybe this would be cleaner/faster if I query Doc for the toolbar,
      query subset of controls from first result.
    */
    const params = urlUtil.getUrlSearchParams();
    if (params.editPanel != null && atlas) {
      // When in edit mode, enable mousewheel scrolling and show all toolbar elements
      atlas.map.scrollWheelZoom.enable();
      document
        .querySelectorAll<HTMLElement>(`#${mapID} .leaflet-control-zoom a`)
        .forEach((e) => (e.style.display = ''));
    } else if (atlas) {
      // Otherwise, disable scrolling, hide any toolbar elements that aren't zoom controls
      atlas.map.scrollWheelZoom.disable();
      document
        .querySelectorAll<HTMLElement>(`#${mapID} .leaflet-control-zoom :not([class*=leaflet-control-zoom-])`)
        .forEach((e) => (e.style.display = 'none'));

      atlas.editor.disableAllModes();
      if (atlas.editor.sidebar.sbContainer) {
        atlas.editor.hideSidebar();
      }
    }
  }

  render() {
    return (
      <div
        id={this.state.mapWrapperID}
        style={{
          position: 'relative',
          /*  
          The below value was set s.t. it was below a grafana panel header z-index of 10
          Otherwise, this panel would obscure the panel header dropdown on the Grafana dash.
          Ideally, this value could be set as an offset of the z-index of whatever div or element is above us.
          */
          zIndex: 9,
          height: this.props.height,
          width: this.props.width,
        }}
      >
        <div id={this.state.mapID} style={{ height: '100%' }}></div>
        <div className={this.getMapSelectorClass().join(' ')}>
          <div className={cx(styles.slectorWrapper)}>
            <span className={cx(styles.layerName)}>Maps</span>
            <Select
              onChange={(e) => {
                this.setLayerDisplay(e);
              }}
              isMulti={true}
              options={this.getAllMapLayers()}
              value={this.getSelectedMapLayers()}
            />
          </div>
          <div
            className={cx(styles.toggleMapSelectorArea)}
            onClick={(e) =>
              this.setState((s) => {
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
