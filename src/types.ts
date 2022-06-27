type mapTypes = 'custom' | 'url';
export type CircuitDataType = number | null;

export interface MapUrl {
  [key: string]: {
    name: string;
    url: string;
    display: boolean;
  };
}

export interface MapViewInterface {
  lat: string;
  lng: string;
  zoom: string;
  minZoom: number;
  maxZoom: number;
}

export interface SimpleOptions {
  mapType: mapTypes;
  customMapJSON: TextOptions;
  mapURLs: MapUrl;
  mapTile: boolean;
  mapTileURL: string;
  weatherTile: boolean;
  mapView: MapViewInterface;
  legend: LegendOptions;
  topology: TopologyOptions;
  mapSelector: boolean;
  dataAggregateGroups: DataAggregateGroup[];
  dataMappings: DataMappingOptions;
}

export interface DataMappingOptions {
  dataTarget: string;
  dataAggregate: 'first' | 'sum';
  colorCriteria: 'now' | 'min' | 'max' | 'avg';
}

export interface DataAggregateGroup {
  aggregate_group: string;
  pattern: string;
}

export type TextMode = 'json' | 'html' | 'markdown';
export interface TextOptions {
  mode: TextMode;
  content: string;
}

export type TargetType = 'latest' | 'mean' | 'min' | 'max';
export interface LegendOptions {
  orientation: 'horizontal' | 'vertical';
  type: 'absolute' | 'percent';
  colors: string[];
  threshold: string[];
  display: boolean;
  size: string;
  target: TargetType;
  textColor: string;
  unit: string;
}

export interface TopologyOptions {
  point: {
    color: string;
    tooltip: {
      display: boolean;
      static: boolean;
      custom: boolean;
      content: string;
    };
  };
  line: {
    color: string;
    tooltip: {
      display: boolean;
      custom: boolean;
      content: string;
    };
  };
}
