export const A11yContrast = {
  OPTION_SIZE: 5,
  NORMAL: 0,
  DARK: 1,
  INVERT: 2,
  HIGH: 3,
  LOW: 4,
};

export const A11yContrastClass = (contrastLevel) => {
  switch (contrastLevel) {
    case A11yContrast.INVERT:
      return 'a11y-contrast-invert';
    case A11yContrast.DARK:
      return 'dark';
    case A11yContrast.HIGH:
      return 'a11y-contrast-high';
    case A11yContrast.LOW:
      return 'a11y-contrast-low';
    default:
      return '';
  }
};

export const A11yTextSize = {
  OPTION_SIZE: 3,
  NORMAL: 0,
  LARGE: 1,
  LARGER: 2,
};

export const A11yTextSizeClass = (textSizeLevel) => {
  if (textSizeLevel !== A11yTextSize.NORMAL) {
    return `a11y-text-size-${textSizeLevel}`;
  }
  return '';
};

export const A11yTextSpacing = {
  OPTION_SIZE: 3,
  NORMAL: 0,
  WIDE: 1,
  WIDER: 2,
};

export const A11yTextSpacingClass = (textSpacingLevel) => {
  if (textSpacingLevel !== A11yTextSpacing.NORMAL) {
    return `a11y-spacing-${textSpacingLevel}`;
  }
  return '';
};

export const A11yLineHeight = {
  OPTION_SIZE: 3,
  NORMAL: 0,
  WIDE: 1,
  WIDER: 2,
};

export const A11yLineHeightClass = (lineHeightLevel) => {
  if (lineHeightLevel !== A11yLineHeight.NORMAL) {
    return `a11y-leading-${lineHeightLevel}`;
  }
  return '';
};

export const A11yTextAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  getA11yTextAlignStep: (align) => {
    switch (align) {
      case 'center':
        return 1;
      case 'right':
        return 2;
      default:
        return 0;
    }
  },
};

export const A11yTextAlignClass = (textAlign) => {
  if (textAlign !== A11yTextAlign.LEFT) {
    return `a11y-align-${textAlign}`;
  }
  return '';
};

export const A11ySmartContrastClass = (smartContrast) => {
  return smartContrast ? 'a11y-smart-contrast' : '';
};

export const A11yLinkHighlightClass = (highlightLinks) => {
  return highlightLinks ? 'a11y-link-highlight' : '';
};

export const A11yCursorHighlightClass = (cursorHighlight) => {
  return cursorHighlight ? 'a11y-cursor-highlight' : '';
};
