import { CLASS_NAMES } from './constants';

const options = {
  elements: [
    {
      name: '$preview',
      description: 'The HTML element that displays image preview.',
      defaultSelector: `.${CLASS_NAMES.PREVIEW}`,
    },
    {
      name: '$fileInput',
      description: 'File input element.',
      defaultSelector: `input.${CLASS_NAMES.FILE_INPUT}`,
    },
    {
      name: '$zoomSlider',
      description: 'Range input element that controls image zoom.',
      defaultSelector: `input.${CLASS_NAMES.ZOOM_SLIDER}`,
    },
  ].map((o) => {
    o.type = 'jQuery element';
    o.default = `$imageCropper.find('${o.defaultSelector}')`;
    return o;
  }),

  values: [
    {
      name: 'width',
      type: 'number',
      description: 'Width of image preview in pixels. If set, it will override the CSS property.',
      default: null,
    },
    {
      name: 'height',
      type: 'number',
      description: 'Height of image preview in pixels. If set, it will override the CSS property.',
      default: null,
    },
    {
      name: 'imageBackground',
      type: 'boolean',
      description: 'Whether or not to display the background image beyond the preview area.',
      default: false,
    },
    {
      name: 'imageBackgroundBorderWidth',
      type: 'array or number',
      description: `Width of background image border in pixels.
        The four array elements specify the width of background image width on the top, right, bottom, left side respectively.
        The background image beyond the width will be hidden.
        If specified as a number, border with uniform width on all sides will be applied.`,
      default: [0, 0, 0, 0],
    },
    {
      name: 'exportZoom',
      type: 'number',
      description: `The ratio between the desired image size to export and the preview size.
        For example, if the preview size is \`300px * 200px\`, and \`exportZoom = 2\`, then
        the exported image size will be \`600px * 400px\`.
        This also affects the maximum zoom level, since the exported image cannot be zoomed to larger than its original size.`,
      default: 1,
    },
    {
      name: 'allowDragNDrop',
      type: 'boolean',
      description: 'When set to true, you can load an image by dragging it from local file browser onto the preview area.',
      default: true,
    },
    {
      name: 'minZoom',
      type: 'string',
      description: `This options decides the minimal zoom level of the image.
        If set to \`'fill'\`, the image has to fill the preview area, i.e. both width and height must not go smaller than the preview area.
        If set to \`'fit'\`, the image can shrink further to fit the preview area, i.e. at least one of its edges must not go smaller than the preview area.`,
      default: 'fill',
    },
    {
      name: 'maxZoom',
      type: 'number',
      description: 'Determines how big the image can be zoomed. E.g. if set to 1.5, the image can be zoomed to 150% of its original size.',
      default: 1,
    },
    {
      name: 'initialZoom',
      type: 'string',
      description: `Determines the zoom when an image is loaded.
        When set to \`'min'\`, image is zoomed to the smallest when loaded.
        When set to \`'image'\`, image is zoomed to 100% when loaded.`,
      default: 'min',
    },
    {
      name: 'freeMove',
      type: 'boolean',
      description: 'When set to true, you can freely move the image instead of being bound to the container borders',
      default: false,
    },
    {
      name: 'smallImage',
      type: 'string',
      description: `When set to \`'reject'\`, \`onImageError\` would be called when cropit loads an image that is smaller than the container.
        When set to \`'allow'\`, images smaller than the container can be zoomed down to its original size, overiding \`minZoom\` option.
        When set to \`'stretch'\`, the minimum zoom of small images would follow \`minZoom\` option.`,
      default: 'reject',
    },
  ],

  callbacks: [
    {
      name: 'onFileChange',
      description: 'Called when user selects a file in the select file input.',
      params: [
        {
          name: 'event',
          type: 'object',
          description: 'File change event object',
        },
      ],
    },
    {
      name: 'onFileReaderError',
      description: 'Called when `FileReader` encounters an error while loading the image file.',
    },
    {
      name: 'onImageLoading',
      description: 'Called when image starts to be loaded.',
    },
    {
      name: 'onImageLoaded',
      description: 'Called when image is loaded.',
    },
    {
      name: 'onImageError',
      description: 'Called when image cannot be loaded.',
      params: [
        {
          name: 'error',
          type: 'object',
          description: 'Error object.',
        },
        {
          name: 'error.code',
          type: 'number',
          description: 'Error code. `0` means generic image loading failure. `1` means image is too small.',
        },
        {
          name: 'error.message',
          type: 'string',
          description: 'A message explaining the error.',
        },
      ],
    },
    {
      name: 'onZoomEnabled',
      description: 'Called when image the zoom slider is enabled.',
    },
    {
      name: 'onZoomDisabled',
      description: 'Called when image the zoom slider is disabled.',
    },
    {
      name: 'onZoomChange',
      description: 'Called when zoom changes.',
      params: [
        {
          name: 'zoom',
          type: 'number',
          description: 'New zoom.',
        },
      ],
    },
    {
      name: 'onOffsetChange',
      description: 'Called when image offset changes.',
      params: [
        {
          name: 'offset',
          type: 'object',
          description: 'New offset, with `x` and `y` values.',
        },
      ],
    },
  ].map((o) => { o.type = 'function'; return o; }),
};

export const loadDefaults = ($el) => {
  const defaults = {};
  if ($el) {
    options.elements.forEach((o) => {
      defaults[o.name] = $el.find(o.defaultSelector);
    });
  }
  options.values.forEach((o) => {
    defaults[o.name] = o.default;
  });
  options.callbacks.forEach((o) => {
    defaults[o.name] = () => {};
  });

  return defaults;
};

export default options;
