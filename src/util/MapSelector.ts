import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';

export const getMapSelectorTheme = stylesFactory((theme: GrafanaTheme) => ({
  mapSelectorContainer: css`
    position: absolute;
    max-width: 250px;
    min-width: 200px;
    background: ${theme.colors.bg1};
    top: 0;
    right: 0;
    z-index: 1000;
  `,
  mapSelectorHide: css`
    display: none;
  `,
  mapSelectorCollapsed: css`
    transform: translateY(calc(-100% + 20px));
  `,
  slectorWrapper: css`
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
    display: block;
    border-top: 1px solid ${theme.colors.border1}
    height: 20px;
    background: ${theme.colors.bg2};
    text-align: center;
    cursor: pointer;
    &:hover {
      background: ${theme.colors.bg3};
    }
  `,
}));
