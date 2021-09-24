import React, { FC } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme, Select } from '@grafana/ui';
import { GrafanaTheme, SelectableValue, StandardEditorProps } from '@grafana/data';

import { DataAggregateGroup, DataMappingOptions, SimpleOptions } from '../types';

const getDataTargetCurrentValue = (options: DataMappingOptions): SelectableValue => {
  switch (options.dataTarget) {
    case 'chooseMax':
      return {
        value: 'chooseMax',
        label: 'Max of Aggregate Group',
        description: `Color topology based on highest \`${options.colorCriteria}\` value between all data aggregate groups`,
      };
      break;
    case 'chooseMin':
      return {
        value: 'chooseMin',
        label: 'Min of Aggregate Group',
        description: `Color topology based on lowest \`${options.colorCriteria}\` value between all data aggregate groups`,
      };
      break;
    default:
      return {
        value: options.dataTarget,
        label: options.dataTarget,
        description: `Color topology based on values from the \`${options.dataTarget}\` aggregate group`,
      };
  }
};

const getDataTargetValues = (aggregateGroups: DataAggregateGroup[], options: DataMappingOptions) => {
  let values: SelectableValue[] = [
    {
      value: 'chooseMax',
      label: 'Max of Aggregate Group',
      description: `Color topology based on highest \`${options.colorCriteria}\` value between all data aggregate groups`,
    },
    {
      value: 'chooseMin',
      label: 'Min of Aggregate Group',
      description: `Color topology based on lowest \`${options.colorCriteria}\` value between all data aggregate groups`,
    },
  ];

  for (const group of aggregateGroups) {
    values.push({
      value: group.aggregate_group,
      label: group.aggregate_group,
      description: `Color topology based on \`${options.colorCriteria}\` values from the \`${group.aggregate_group}\` aggregate group`,
    });
  }

  return values;
};

const getDataAggregateCurrentValue = (options: DataMappingOptions): SelectableValue => {
  if (options.dataAggregate === 'first') {
    return {
      value: 'first',
      label: 'Select First Matching Datapoint',
      description: 'All other matching datapoints for the same data aggregate group will be ignored',
    };
  }
  return {
    value: 'sum',
    label: 'Sum Matching Datapoints',
    description: 'All matching datapoints found for the same data aggregate group will be added per timestamp',
  };
};

// Util Functions
function properCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getColorCriteriaCurrentValue = (options: DataMappingOptions): SelectableValue => {
  switch (options.colorCriteria) {
    case 'now':
      return {
        value: 'now',
        label: 'Latest',
      };
    default:
      return {
        value: 'options.colorCriteria',
        label: properCase(options.colorCriteria),
      };
  }
};

export const DataMappingEditor: FC<StandardEditorProps<DataMappingOptions, any, SimpleOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <div className={cx(styles.editorBox)}>
      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Select Datapoints</span>
        <span className={cx(styles.layerDescription)}>
          Choose a calculation to perform when multiple datapoints are found for a single data aggregate group
        </span>
        <Select
          onChange={e => {
            onChange({
              ...value,
              dataAggregate: e.value!,
            });
          }}
          value={getDataAggregateCurrentValue(value)}
          options={[
            {
              value: 'first',
              label: 'Select First Matching Datapoint',
              description: 'All other matching datapoints for the same data aggregate group will be ignored',
            },
            {
              value: 'sum',
              label: 'Sum Matching Datapoints',
              description:
                'All matching datapoints found for the same data aggregate group will be added per timestamp',
            },
          ]}
        />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Calculation</span>
        <span className={cx(styles.layerDescription)}>
          Choose a reducer function / calculation to reduce data to a single value
        </span>
        <Select
          onChange={e => {
            onChange({
              ...value,
              colorCriteria: e.value!,
            });
          }}
          value={getColorCriteriaCurrentValue(value)}
          options={[
            { label: 'Latest', value: 'now' },
            { label: 'Avg', value: 'avg' },
            { label: 'Min', value: 'min' },
            { label: 'Max', value: 'max' },
          ]}
        />
      </div>

      <div className={cx(styles.inputContainer)}>
        <span className={cx(styles.layerName)}>Select Data Target</span>
        <span className={cx(styles.layerDescription)}>
          Select a data aggregate group / calculation to color circuits on
        </span>
        <Select
          onChange={e => {
            onChange({
              ...value,
              dataTarget: e.value!,
            });
          }}
          value={getDataTargetCurrentValue(value)}
          options={getDataTargetValues(context.options!.dataAggregateGroups, value)}
        />
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
  layerDescription: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formDescription};
    margin-bottom: 4px;
  `,
  layerName: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formLabel};
    font-weight: 500;
  `,
}));
