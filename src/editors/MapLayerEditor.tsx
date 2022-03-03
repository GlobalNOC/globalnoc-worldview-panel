import React, { FC, useState, useEffect } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme, Icon } from '@grafana/ui';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

import { TextOptions, MapUrl } from '../types';

type layerEditValues = 'name' | 'url' | 'delete';

export const MapLayerEditor: FC<StandardEditorProps<MapUrl, any, TextOptions>> = ({ value, onChange, context }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [urlObj, setUrlObj] = useState<MapUrl>(JSON.parse(JSON.stringify(value)));
  const [isFocused, setIsFocused] = useState<boolean>(true);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: string, val: layerEditValues) {
    let clone = JSON.parse(JSON.stringify(urlObj));

    if (val === 'name' || val === 'url') {
      clone[id][val] = e.target.value;
      setUrlObj(clone);
    }
  }

  function handleDelete(id: string) {
    let clone = JSON.parse(JSON.stringify(urlObj));
    delete clone[id];
    onChange(clone);
    setUrlObj(clone);
  }

  useEffect(() => {
    if (!isFocused) {
      onChange(urlObj);
      setIsFocused(true);
    }
  }, [isFocused, urlObj, onChange]);

  let layers: JSX.Element[] = [];
  function createLayers() {
    let count = 1;
    for (const id in urlObj) {
      let layer = (
        <div className={cx(styles.layerSection)} key={id}>
          <div className={cx(styles.layerHeader)}>
            <span style={{ gridArea: '1 / 1 / 2 / 2' }} className={cx(styles.layerName)}>
              Layer {count}
            </span>
            <span style={{ gridArea: '2 / 1 / 3 / 2' }} className={cx(styles.inputLabel)}>
              Map Name
            </span>
            <span
              style={{
                gridArea: '1 / 2 / 3 / 3',
                position: 'relative',
              }}
              className={cx(styles.inputLabel)}
            >
              <Icon
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
                name={'trash-alt'}
                onClick={(e) => handleDelete(id)}
              />
            </span>
          </div>
          <input
            className={cx(styles.inputText)}
            onChange={(e) => handleChange(e, id, 'name')}
            onBlur={(e) => setIsFocused(false)}
            type="text"
            placeholder="Map Name"
            value={urlObj[id]['name']}
          />
          <span className={cx(styles.inputLabel)}>URL</span>
          <input
            className={cx(styles.inputText)}
            onChange={(e) => handleChange(e, id, 'url')}
            onBlur={(e) => setIsFocused(false)}
            type="text"
            placeholder="URL"
            value={urlObj[id]['url']}
          />
        </div>
      );
      layers.push(layer);
      count++;
    }
  }

  function addLayer() {
    let clone = JSON.parse(JSON.stringify(urlObj));
    let newID = createUniqueName(5);
    clone[newID] = { name: '', url: '', display: true };
    setUrlObj(clone);
  }

  createLayers();
  return (
    <div className={cx(styles.editorBox)}>
      {layers}
      <button onClick={(e) => addLayer()} className={cx(styles.addLayer)}>
        + Add Layer
      </button>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  editorBox: css`
    label: editorBox;
    margin: ${theme.spacing.xs} 0;
    width: 100%;
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
  layerHeader: css`
    display: grid;
    grid-template-columns: auto 44px;
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  `,
  layerName: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formLabel};
    font-weight: 500;
    margin-bottom: 4px;
  `,
  inputLabel: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formDescription};
    margin: 2px 0px;
  `,
  layerSection: css`
    margin-bottom: 20px;
  `,
  addLayer: css`
    background: linear-gradient(${theme.colors.bg2} 0%, ${theme.colors.bg3} 100%);
    font-size: 12px;
    border: 1px solid ${theme.colors.border1};
    height: 22px;
    padding: 0px 8px;
    border-radius: 2px;
    color: ${'dark-blue'};
    &:hover {
      background: ${theme.colors.bg2};
    }
  `,
}));

// box-shadow: rgb(20 22 25) 0px 0px 0px 2px, rgb(31 96 196) 0px 0px 0px 4px;

function createUniqueName(length: number): string {
  let result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
