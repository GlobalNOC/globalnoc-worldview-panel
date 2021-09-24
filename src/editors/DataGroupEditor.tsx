import React, { FC, useState, useEffect } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme, Icon } from '@grafana/ui';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

// import React, { FC, useState, useEffect } from 'react';
// import { css, cx } from 'emotion';
// import { stylesFactory, useTheme, Icon } from '@grafana/ui';
// import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

import { TextOptions, DataAggregateGroup } from '../types';

type LayerEditValues = 'aggregate_group' | 'pattern';

export const DataGroupEditor: FC<StandardEditorProps<DataAggregateGroup[], any, TextOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [dataAggObj, setDataAggObj] = useState<DataAggregateGroup[]>(JSON.parse(JSON.stringify(value)));
  const [isFocused, setIsFocused] = useState<boolean>(true);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, group: DataAggregateGroup, val: LayerEditValues) {
    if (val === 'aggregate_group' || val === 'pattern') {
      group[val] = e.target.value;

      let clone = JSON.parse(JSON.stringify(dataAggObj)) as DataAggregateGroup[];

      setDataAggObj(clone);
    }
  }

  function handleDelete(group: DataAggregateGroup) {
    for (let i = 0; i < dataAggObj.length; i++) {
      const element = dataAggObj[i];
      if (element === group) {
        dataAggObj.splice(i, 1);
        break;
      }
    }

    onChange(dataAggObj);
    setDataAggObj(dataAggObj);
  }

  useEffect(() => {
    if (!isFocused) {
      onChange(dataAggObj);
      setIsFocused(true);
    }
  }, [isFocused, dataAggObj, onChange]);

  let layers: JSX.Element[] = [];
  function createLayers() {
    let count = 1;
    for (const group of dataAggObj) {
      let layer = (
        <div className={cx(styles.layerSection)}>
          <div className={cx(styles.layerHeader)}>
            <span style={{ gridArea: '1 / 1 / 2 / 2' }} className={cx(styles.layerName)}>
              Data Aggregrate Group {count}
            </span>
            <span style={{ gridArea: '2 / 1 / 3 / 2' }} className={cx(styles.inputLabel)}>
              Aggregrate Group Name
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
                onClick={e => handleDelete(group)}
              />
            </span>
          </div>
          <input
            className={cx(styles.inputText)}
            onChange={e => handleChange(e, group, 'aggregate_group')}
            onBlur={e => setIsFocused(false)}
            type="text"
            placeholder="Value"
            value={group.aggregate_group}
          />
          <span className={cx(styles.inputLabel)}>RegEx Pattern</span>
          <input
            className={cx(styles.inputText)}
            onChange={e => handleChange(e, group, 'pattern')}
            onBlur={e => setIsFocused(false)}
            type="text"
            placeholder="RegEx"
            value={group.pattern}
          />
        </div>
      );
      layers.push(layer);
      count++;
    }
  }

  function addLayer() {
    let clone = JSON.parse(JSON.stringify(dataAggObj)) as DataAggregateGroup[];
    clone.push({
      aggregate_group: '',
      pattern: '',
    });

    setDataAggObj(clone);
  }

  createLayers();
  return (
    <div className={cx(styles.editorBox)}>
      {layers}
      <button onClick={e => addLayer()} className={cx(styles.addLayer)}>
        + Add Group
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

// function createUniqueName(length: number): string {
//   let result = '';
//   var characters = 'abcdefghijklmnopqrstuvwxyz';
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }
