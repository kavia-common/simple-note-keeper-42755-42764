import { Theme } from '../theme';

export const surfaces = {
  card: {
    background: Theme.colors.surface,
    border: `1px solid ${Theme.colors.border}`,
    borderRadius: `${Theme.radii.lg}px`,
    boxShadow: `0 2px 8px ${Theme.colors.shadow}`,
  },
  subtleCard: {
    background: Theme.colors.surface,
    border: `1px solid ${Theme.colors.border}`,
    borderRadius: `${Theme.radii.md}px`,
    boxShadow: `0 1px 4px ${Theme.colors.shadow}`,
  },
};

export const transitions = {
  quick: 'all 120ms ease-out',
  medium: 'all 200ms ease',
  slow: 'all 320ms ease',
};

export const focusRing = {
  outline: `2px solid ${Theme.colors.primary}`,
  outlineOffset: '2px',
};
