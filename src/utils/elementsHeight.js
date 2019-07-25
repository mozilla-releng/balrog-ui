import remToPx from './remToPx';

export default theme => ({
  body1TextHeight: (lines = 1) =>
    lines *
    remToPx(theme.typography.body1.fontSize) *
    theme.typography.body1.lineHeight,
  body2TextHeight: (lines = 1) =>
    lines *
    remToPx(theme.typography.body2.fontSize) *
    theme.typography.body2.lineHeight,
  subtitle1TextHeight: (lines = 1) =>
    lines *
    remToPx(theme.typography.subtitle1.fontSize) *
    theme.typography.subtitle1.lineHeight,
  buttonHeight:
    remToPx(theme.typography.button.fontSize) *
      theme.typography.button.lineHeight +
    6 +
    6,
});
