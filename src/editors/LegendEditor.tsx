import React, { FC, useState } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme, Switch, RadioButtonGroup, ColorPicker, Input } from '@grafana/ui';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

import { LegendOptions, SimpleOptions } from '../types';

export const LegendEditor: FC<StandardEditorProps<LegendOptions, any, SimpleOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  let [threshold, setThreshold] = useState<string>(value.threshold.join(','));
  let [unit, setUnit] = useState<string>(value.unit);
  let [size, setSize] = useState<string>(value.size);

  const handledisplayChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange({ ...value, display: !value.display });
  };

  const handleOrientationChange = (val?: 'horizontal' | 'vertical') => {
    if (val) {
      onChange({ ...value, orientation: val });
    }
  };

  const handleTypeChange = (val?: 'absolute' | 'percent') => {
    if (val) {
      onChange({ ...value, type: val });
    }
  };

  const handleLegendTextChange = (val?: string) => {
    if (val) {
      onChange({ ...value, textColor: val });
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange({ ...value, unit: e.target.value });
    }
    setUnit(e.target.value);
  };

  const handleColorChange = (idx: number, val: string) => {
    let colors = value.colors;
    colors.splice(idx, 1, val);
    onChange({ ...value, colors });
  };

  const createColorPickers = () => {
    let colors = value.colors;

    return colors.map((color, idx) => {
      return (
        <span className={cx(styles.colorPickerWrapper)} key={idx}>
          <ColorPicker color={color} enableNamedColors={false} onChange={(value) => handleColorChange(idx, value)} />
        </span>
      );
    });
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setThreshold(inputValue);

    let thresholdsFromInput = inputValue.split(',');
    let incorrectEntries = thresholdsFromInput.filter((val) => val === '' || isNaN(Number(val)));

    if (incorrectEntries.length === 0) {
      let previousThreshold = value.threshold;
      let colors = value.colors;

      let difference = thresholdsFromInput.length - previousThreshold.length;
      if (difference === 0) {
        onChange({ ...value, threshold: thresholdsFromInput });
      } else if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          colors.push('#777c7d');
        }
        onChange({ ...value, threshold: thresholdsFromInput, colors });
      } else {
        for (let i = 0; i < -difference; i++) {
          colors.pop();
        }
        onChange({ ...value, threshold: thresholdsFromInput, colors });
      }
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setSize(inputValue);
  };

  const handleSizeChangeOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (isNaN(Number(inputValue))) {
      setSize(value.size);
      return;
    }

    if (Number(inputValue) > 100) {
      setSize('100');
      onChange({ ...value, size: '100' });
      return;
    }

    if (Number(inputValue) < 0) {
      setSize('0');
      onChange({ ...value, size: '0' });
      return;
    }

    onChange({ ...value, size: inputValue });
  };

  return (
    <div className={cx(styles.editorBox)}>
      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Legend Display</span>
        <Switch value={value.display} style={{ display: 'block' }} onChange={handledisplayChange} />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Legend Type</span>
        <RadioButtonGroup
          value={value.type}
          onChange={handleTypeChange}
          options={[
            { label: 'Absolute', value: 'absolute' },
            { label: 'Percent', value: 'percent' },
          ]}
        />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Orientation</span>
        <RadioButtonGroup
          value={value.orientation}
          onChange={handleOrientationChange}
          options={[
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
          ]}
        />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Legend Text Color</span>
        <span className={cx(styles.colorPickerWrapper)}>
          <ColorPicker
            color={value.textColor}
            enableNamedColors={false}
            onChange={(value) => handleLegendTextChange(value)}
          />
        </span>
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Size (% of container size)</span>
        <Input
          style={{ width: '50%' }}
          width={20}
          value={size}
          onBlur={(e) => handleSizeChangeOnBlur(e as React.ChangeEvent<HTMLInputElement>)}
          onChange={(e) => handleSizeChange(e as React.ChangeEvent<HTMLInputElement>)}
        />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Unit</span>
        <Input value={unit} onChange={(e) => handleUnitChange(e as React.ChangeEvent<HTMLInputElement>)} />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Threshold</span>
        <Input value={threshold} onChange={(e) => handleThresholdChange(e as React.ChangeEvent<HTMLInputElement>)} />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Colors</span>
        <div className={cx(styles.colorPickerContainer)}>{createColorPickers()}</div>
      </div>
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
  inputContainer: css`
    margin-bottom: 8px;
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
  colorPickerContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  `,
  colorPickerWrapper: css`
    display: inline-block;
    padding: 8px;
    background: ${theme.colors.bg3};
    border-radius: 4px;
    width: 31px;
    height: 31px;

    position: relative;
    &:hover {
      background: ${theme.colors.bg2};
    }
  `,
  colorBarAdd: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  `,
}));
