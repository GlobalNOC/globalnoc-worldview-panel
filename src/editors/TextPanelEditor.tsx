import React, { FC, useMemo } from 'react';
import { css, cx } from 'emotion';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  CodeEditor,
  stylesFactory,
  useTheme,
  CodeEditorSuggestionItem,
  variableSuggestionToCodeEditorSuggestion,
} from '@grafana/ui';
import { GrafanaTheme, StandardEditorProps } from '@grafana/data';

import { TextOptions, SimpleOptions } from '../types';

export const TextPanelEditor: FC<StandardEditorProps<TextOptions, any, SimpleOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const language = useMemo(() => value.mode, [value.mode]);
  const theme = useTheme();
  const styles = getStyles(theme);

  // console.log(value);
  const getSuggestions = (): CodeEditorSuggestionItem[] => {
    if (!context.getSuggestions) {
      return [];
    }
    return context.getSuggestions().map((v) => variableSuggestionToCodeEditorSuggestion(v));
  };

  const handleChange = (value: string) => {
    onChange({ content: value, mode: language });
  };

  return (
    <div className={cx(styles.editorBox)}>
      <AutoSizer disableHeight>
        {({ width }) => {
          if (width === 0) {
            return null;
          }
          return (
            <CodeEditor
              value={value.content}
              onBlur={handleChange}
              onSave={handleChange}
              language={language}
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
};

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  editorBox: css`
    label: editorBox;
    border: ${theme.border.width.sm} solid ${theme.colors.border2};
    border-radius: ${theme.border.radius.sm};
    margin: ${theme.spacing.xs} 0;
    width: 100%;
  `,
}));
