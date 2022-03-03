import React, { FC, useState, useEffect } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

import { MapViewInterface, TextOptions } from '../types';

export const MapViewEditor: FC<StandardEditorProps<MapViewInterface, any, TextOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  let [lat, setLat] = useState<string>(value.lat);
  let [lng, setLng] = useState<string>(value.lng);
  let [zoom, setZoom] = useState<string>(value.zoom);

  useEffect(() => {
    setLat(value.lat);
    setLng(value.lng);
    setZoom(value.zoom);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    switch (target) {
      case 'lat':
        setLat(e.target.value);
        break;
      case 'lng':
        setLng(e.target.value);
        break;
      case 'zoom':
        setZoom(e.target.value);
        break;
    }
  }

  function updateValues(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    let inputValue = Number(e.target.value);
    let valueClone = { ...value };
    switch (target) {
      case 'lat':
        if (!isNaN(inputValue)) {
          if (inputValue > 90) {
            inputValue = 90;
          }
          if (inputValue < -90) {
            inputValue = -90;
          }
          valueClone.lat = inputValue.toFixed(4);
          onChange(valueClone);
        } else {
          setLat(valueClone.lat);
        }
        break;
      case 'lng':
        if (!isNaN(inputValue)) {
          if (inputValue > 180) {
            inputValue = 180;
          }
          if (inputValue < -180) {
            inputValue = -180;
          }
          valueClone.lng = inputValue.toFixed(4);
          onChange(valueClone);
        } else {
          setLng(valueClone.lng);
        }
        break;
      case 'zoom':
        if (!isNaN(inputValue)) {
          if (inputValue > valueClone.maxZoom) {
            inputValue = valueClone.maxZoom;
          }
          if (inputValue < valueClone.minZoom) {
            inputValue = valueClone.minZoom;
          }
          valueClone.zoom = String(inputValue);
          onChange(valueClone);
        } else {
          setZoom(valueClone.zoom);
        }
        break;

      default:
        break;
    }
  }

  return (
    <div className={cx(styles.editorBox)}>
      <div>
        <input
          className={cx(styles.inputText)}
          onBlur={(e) => updateValues(e, 'lat')}
          onChange={(e) => handleChange(e, 'lat')}
          type="text"
          value={lat}
        />
        <span className={cx(styles.inputLabel)}>Latitude</span>
      </div>
      <div>
        <input
          className={cx(styles.inputText)}
          onBlur={(e) => updateValues(e, 'lng')}
          onChange={(e) => handleChange(e, 'lng')}
          type="text"
          value={lng}
        />
        <span className={cx(styles.inputLabel)}>Longitude</span>
      </div>
      <div>
        <input
          className={cx(styles.inputText)}
          onBlur={(e) => updateValues(e, 'zoom')}
          onChange={(e) => handleChange(e, 'zoom')}
          type="text"
          value={zoom}
        />
        <span className={cx(styles.inputLabel)}>Zoom</span>
      </div>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  editorBox: css`
    label: editorBox;
    margin: ${theme.spacing.xs} 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 4px;
  `,
  inputText: css`
    height: 32px;
    background-color: ${theme.colors.formInputBg};
    line-height: 1.5;
    font-size: 14px;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border2};
    padding: 0px 8px;
    position: relative;
    z-index: 0;
    -webkit-box-flex: 1;
    flex-grow: 1;
    border-radius: 2px;
    width: 100%;
  `,
  inputLabel: css`
    margin-top: 4px;
    font-size: 12px;
    color: ${theme.colors.text};
    display: block;
    width: 100%;
  `,
}));
