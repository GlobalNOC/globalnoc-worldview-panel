import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';

export const getMapSelectorTheme = stylesFactory((theme: GrafanaTheme) => ({
  mapSelectorContainer: css`
    position: absolute;
    display: flex;
    max-height: 150px;
    min-height: 100px;
    max-width: 250px;
    background: ${theme.colors.bg1};
    top: 32px;
    right: 0;
    z-index: 1000;
  `,
  mapSelectorHide: css`
    display: none;
  `,
  mapSelectorCollapsed: css`
    & > div:last-child {
      display: none;
    }
  `,
  selectorWrapper: css`
    padding: 10px;
  `,
  layerName: css`
    display: block;
    font-size: 12px;
    color: ${theme.colors.formLabel};
    font-weight: 500;
    margin-bottom: 4px;
  `,
  toggleMapSelectorArea: css`
    display: flex;
    border-top: 1px solid ${theme.colors.border1}
    background: ${theme.colors.bg2};
    align-items: center;
    cursor: pointer;
    &:hover {
      background: ${theme.colors.bg3};
    }
  `,
}));
