import React, { FC } from 'react';
import { css, cx } from 'emotion';
import {
  stylesFactory,
  useTheme,
  ColorPicker,
  Switch,
  CodeEditor,
  CodeEditorSuggestionItem,
  variableSuggestionToCodeEditorSuggestion,
} from '@grafana/ui';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';
import { TopologyOptions, SimpleOptions } from '../types';
import pointHtml from '../config/pointHtml.js';
import lineHtml from '../config/lineHtml.js';

export const TopologyEditor: FC<StandardEditorProps<TopologyOptions, any, SimpleOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const getSuggestions = (): CodeEditorSuggestionItem[] => {
    if (!context.getSuggestions) {
      return [];
    }
    return context.getSuggestions().map((v) => variableSuggestionToCodeEditorSuggestion(v));
  };

  const handleColorChange = (color: string, layer: 'point' | 'line') => {
    let val = value;
    val[layer].color = color;
    onChange(val);
  };

  const handleTooltipOptionsChange = (target: string, layer: 'point' | 'line') => {
    let val = value;
    if (target === 'custom' && val[layer].tooltip[target] && layer === 'point') {
      val[layer].tooltip.content = pointHtml;
    }
    if (target === 'custom' && val[layer].tooltip[target] && layer === 'line') {
      val[layer].tooltip.content = lineHtml;
    }
    val[layer].tooltip[target] = !val[layer].tooltip[target];
    onChange(val);
  };

  const handleTooltipContentChange = (content: string, layer: 'point' | 'line') => {
    let val = value;
    val[layer].tooltip.content = content;
    onChange(val);
  };

  const createNodeTooltipCodeEditor = () => {
    if (value['point'].tooltip.custom) {
      return (
        <div className={cx(styles.inputContainer)}>
          <AutoSizer disableHeight>
            {({ width }) => {
              if (width === 0) {
                return null;
              }
              return (
                <CodeEditor
                  value={value['point'].tooltip.content}
                  onBlur={(content) => handleTooltipContentChange(content, 'point')}
                  onSave={(content) => handleTooltipContentChange(content, 'point')}
                  language={'html'}
                  width={width}
                  showMiniMap={false}
                  showLineNumbers={false}
                  height="200px"
                  getSuggestions={getSuggestions}
                />
              );
            }}
          </AutoSizer>
        </div>
      );
    }
    return '';
  };

  const createLineTooltipCodeEditor = () => {
    if (value['line'].tooltip.custom) {
      return (
        <div className={cx(styles.inputContainer)}>
          <AutoSizer disableHeight>
            {({ width }) => {
              if (width === 0) {
                return null;
              }
              return (
                <CodeEditor
                  value={value['line'].tooltip.content}
                  onBlur={(content) => handleTooltipContentChange(content, 'line')}
                  onSave={(content) => handleTooltipContentChange(content, 'line')}
                  language={'html'}
                  width={width}
                  showMiniMap={false}
                  showLineNumbers={false}
                  height="200px"
                  getSuggestions={getSuggestions}
                />
              );
            }}
          </AutoSizer>
        </div>
      );
    }
    return '';
  };

  return (
    <div className={cx(styles.editorBox)}>
      <span className={cx(styles.sectionHeader)}>Point Defaults</span>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Default Color</span>
        <span className={cx(styles.colorPickerWrapper)}>
          <ColorPicker
            color={value.point.color}
            onChange={(val) => handleColorChange(val, 'point')}
            enableNamedColors={false}
          />
        </span>
      </div>

      <div className={cx(styles.nodeSwitchContainer)}>
        <div className={cx(styles.inlineBlockContainer)}>
          <span className={cx(styles.layerNameInlineBlock)}>Display Tooltip</span>
          <Switch
            value={value.point.tooltip.display}
            style={{ display: 'inline-block' }}
            onChange={() => handleTooltipOptionsChange('display', 'point')}
          />
        </div>
        <div className={cx(styles.inlineBlockContainer)}>
          <span className={cx(styles.layerNameInlineBlock)}>Static Tooltip</span>
          <Switch
            value={value.point.tooltip.static}
            style={{ display: 'inline-block' }}
            onChange={() => handleTooltipOptionsChange('static', 'point')}
          />
        </div>
        <div className={cx(styles.inlineBlockContainer)}>
          <span className={cx(styles.layerNameInlineBlock)}>Custom Tooltip</span>
          <Switch
            value={value.point.tooltip.custom}
            style={{ display: 'inline-block' }}
            onChange={() => handleTooltipOptionsChange('custom', 'point')}
          />
        </div>
      </div>

      {createNodeTooltipCodeEditor()}

      <span className={cx(styles.sectionHeader)}>Line Defaults</span>
      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Default Color</span>
        <span className={cx(styles.colorPickerWrapper)}>
          <ColorPicker
            color={value.line.color}
            onChange={(val) => handleColorChange(val, 'line')}
            enableNamedColors={false}
          />
        </span>
      </div>

      <div className={cx(styles.nodeSwitchContainer)}>
        <div className={cx(styles.inlineBlockContainer)}>
          <span className={cx(styles.layerNameInlineBlock)}>Display Tooltip</span>
          <Switch
            value={value.line.tooltip.display}
            style={{ display: 'inline-block' }}
            onChange={() => handleTooltipOptionsChange('display', 'line')}
          />
        </div>
        <div className={cx(styles.inlineBlockContainer)}>
          <span className={cx(styles.layerNameInlineBlock)}>Custom Tooltip</span>
          <Switch
            value={value.line.tooltip.custom}
            style={{ display: 'inline-block' }}
            onChange={() => handleTooltipOptionsChange('custom', 'line')}
          />
        </div>
      </div>

      {createLineTooltipCodeEditor()}
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  editorBox: css`
    label: editorBox;
    margin: ${theme.spacing.xs} 0;
    width: 100%;
    margin-top: 12px;
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
  nodeSwitchContainer: css`
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  layerName: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formLabel};
    font-weight: 500;
    margin-bottom: 4px;
  `,
  sectionHeader: css`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.formDescription};
    margin: 2px 0px;
  `,
  layerSection: css`
    margin-bottom: 20px;
  `,
  layerNameInlineBlock: css`
    display: inline-block;
    font-size: 12px;
    color: ${theme.colors.formLabel};
    font-weight: 500;
    margin-bottom: 4px;
  `,
  inlineBlockContainer: css`
    display: inline-block;

    padding-right: 8px;
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
}));
