export const PLUGIN_KEY = 'cropit';

export const DEFAULTS = {
  exportZoom: 1,
  imageBackground: false,
  imageBackgroundBorderWidth: 0,
  imageState: null,
  allowDragNDrop: true,
  freeMove: false,
  maxZoom: 1,
  minZoom: 'fill',
  initialZoom: 'min',
  rejectSmallImage: false,
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
