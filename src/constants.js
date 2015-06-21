export const PLUGIN_KEY = 'cropit';

export const CLASS_NAMES = {
  PREVIEW: 'cropit-image-preview',
  PREVIEW_CONTAINER: 'cropit-image-preview-container',
  FILE_INPUT: 'cropit-image-input',
  ZOOM_SLIDER: 'cropit-image-zoom-input',
  IMAGE_BACKGROUND: 'cropit-image-background',
  IMAGE_BACKGROUND_CONTAINER: 'cropit-image-background-container',
  PREVIEW_HOVERED: 'cropit-preview-hovered',
  DRAG_HOVERED: 'cropit-drag-hovered',
  IMAGE_LOADING: 'cropit-image-loading',
  IMAGE_LOADED: 'cropit-image-loaded',
  DISABLED: 'cropit-disabled',
};

export const ERRORS = {
  IMAGE_FAILED_TO_LOAD: { code: 0, message: 'Image failed to load.' },
  SMALL_IMAGE: { code: 1, message: 'Image is too small.' },
};

const eventName = (events) => events.map((e) => `${e}.cropit`).join(' ');
export const EVENTS = {
  PREVIEW: eventName([
    'mousedown', 'mouseup', 'mouseleave',
    'touchstart', 'touchend', 'touchcancel', 'touchleave',
  ]),
  PREVIEW_MOVE: eventName(['mousemove', 'touchmove']),
  ZOOM_INPUT: eventName(['mousemove', 'touchmove', 'change']),
};
