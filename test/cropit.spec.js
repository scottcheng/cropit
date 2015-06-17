jest
  .dontMock('jquery')
  .dontMock('../src/constants')
  .dontMock('../src/cropit');

import $ from 'jquery';
import { ERRORS } from '../src/constants';
import Cropit from '../src/cropit';

const IMAGE_URL = 'http://example.com/image.jpg';
const IMAGE_DATA = 'data:image/png;base64,image-data...';

const newCropit = (options) => {
  return new Cropit($, null, options);
};

describe('Cropit', () => {
  let cropit = null;

  it('sets default options', () => {
    cropit = newCropit();
    expect(cropit.options.exportZoom).toBe(1);
    expect(cropit.options.imageBackground).toBe(false);
    expect(cropit.options.imageBackgroundBorderWidth).toBe(0);
    expect(cropit.options.imageState).toBe(null);
    expect(cropit.options.allowDragNDrop).toBe(true);
    expect(cropit.options.freeMove).toBe(false);
    expect(cropit.options.minZoom).toBe('fill');
    expect(cropit.options.rejectSmallImage).toBe(false);
  });

  describe('#init', () => {
    it('calls loadImage if image source is present', () => {
      cropit = newCropit({ imageState: { src: IMAGE_URL } });
      spyOn(cropit, 'loadImage');

      cropit.init();
      expect(cropit.loadImage).toHaveBeenCalled();
    });
  });

  describe('#onFileReaderLoaded', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('calls loadImage', () => {
      spyOn(cropit, 'loadImage');

      cropit.onFileReaderLoaded({ target: { result: IMAGE_DATA } });
      expect(cropit.loadImage).toHaveBeenCalled();
    });

    it('sets imageSrc', () => {
      cropit.imageSrc = IMAGE_URL;
      expect(cropit.imageSrc).not.toBe(IMAGE_DATA);

      cropit.onFileReaderLoaded({ target: { result: IMAGE_DATA } });
      expect(cropit.imageSrc).toBe(IMAGE_DATA);
    });
  });

  describe('#loadImage', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('sets image source', () => {
      expect(cropit.image.src).not.toBe(IMAGE_DATA);

      cropit.loadImage(IMAGE_DATA);
      expect(cropit.image.src).toBe(IMAGE_DATA);
    });
  });

  describe('#onImageLoaded', () => {
    it('centers image', () => {
      cropit = newCropit();
      spyOn(cropit, 'centerImage');
      cropit.onImageLoaded();
      expect(cropit.centerImage).toHaveBeenCalled();
    });

    describe('rejectSmallImage set to true', () => {
      beforeEach(() => {
        cropit = newCropit({ rejectSmallImage: true });
      });

      it('rejects image where image width is smaller than preview width', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.image = { width: 1, height: 3 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalled();
      });

      it('rejects image where image height is smaller than preview height', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.image = { width: 3, height: 1 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });

      it('does not reject image if it is larger than preview', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.image = { width: 3, height: 3 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('rejectSmallImage set to true and exportZoom not 1', () => {
      beforeEach(() => {
        cropit = newCropit({ rejectSmallImage: true, exportZoom: 2 });
      });

      it('rejects image if image is smaller than preview after applying exportZoom', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.image = { width: 3, height: 3 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('rejectSmallImage set to true and maxZoom not 1', () => {
      beforeEach(() => {
        cropit = newCropit({ rejectSmallImage: true, maxZoom: 2 });
      });

      it('does not reject image if maxZoom allows image to be zoomed beyond preview', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 4, h: 4 };
        cropit.image = { width: 3, height: 3 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('rejectSmallImage set to false', () => {
      beforeEach(() => {
        cropit = newCropit({ rejectSmallImage: false });
      });

      it('does not reject small image', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.image = { width: 1, height: 1 };
        cropit.onImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalled();
      });
    });
  });

  describe('#onPreviewEvent', () => {
    describe('mouse event', () => {
      const previewEvent = {
        type: 'mousedown',
        clientX: 1,
        clientY: 1,
        stopPropagation: () => {},
      };

      beforeEach(() => {
        cropit = newCropit();
      });

      it('sets origin coordinates on mousedown', () => {
        expect(cropit.origin).not.toEqual({ x: 1, y: 1 });

        cropit.imageLoaded = true;
        cropit.onPreviewEvent(previewEvent);
        expect(cropit.origin).toEqual({ x: 1, y: 1 });
      });

      it('calls stopPropagation', () => {
        spyOn(previewEvent, 'stopPropagation');
        cropit.imageLoaded = true;
        cropit.onPreviewEvent(previewEvent);
        expect(previewEvent.stopPropagation).toHaveBeenCalled();
      });

      it('does nothing before loading image', () => {
        spyOn(previewEvent, 'stopPropagation');
        cropit.onPreviewEvent(previewEvent);
        expect(cropit.origin).not.toEqual({ x: 1, y: 1 });
        expect(previewEvent.stopPropagation).not.toHaveBeenCalled();
      });
    });

    describe('touch event', () => {
      const previewEvent = {
        type: 'touchstart',
        originalEvent: { touches: [{ clientX: 1, clientY: 1 }] },
        stopPropagation: () => {},
      };

      beforeEach(() => {
        cropit = newCropit();
      });

      it('sets origin coordinates on mousedown', () => {
        expect(cropit.origin).not.toEqual({ x: 1, y: 1 });

        cropit.imageLoaded = true;
        cropit.onPreviewEvent(previewEvent);
        expect(cropit.origin).toEqual({ x: 1, y: 1 });
      });

      it('calls stopPropagation', () => {
        spyOn(previewEvent, 'stopPropagation');
        cropit.imageLoaded = true;
        cropit.onPreviewEvent(previewEvent);
        expect(previewEvent.stopPropagation).toHaveBeenCalled();
      });

      it('does nothing before loading image', () => {
        spyOn(previewEvent, 'stopPropagation');
        cropit.onPreviewEvent(previewEvent);
        expect(cropit.origin).not.toEqual({ x: 1, y: 1 });
        expect(previewEvent.stopPropagation).not.toHaveBeenCalled();
      });
    });
  });

  describe('#fixOffset', () => {
    beforeEach(() => {
      cropit = newCropit();
      cropit.imageLoaded = true;
    });

    describe('fixes x', () => {
      it('fits image to left if image width is less than preview', () => {
        cropit.imageSize = { w: 1 };
        cropit.zoom = 0.5;
        cropit.previewSize = { w: 1 };
        const offset = cropit.fixOffset({ x: -1 });
        expect(offset.x).toBe(0);
      });

      it('fits image to left', () => {
        cropit.imageSize = { w: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { w: 1 };
        const offset = cropit.fixOffset({ x: 1 });
        expect(offset.x).toBe(0);
      });

      it('fits image to right', () => {
        cropit.imageSize = { w: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { w: 1 };
        const offset = cropit.fixOffset({ x: -2 });
        expect(offset.x).toBe(-1);
      });

      it('rounds x', () => {
        cropit.imageSize = { w: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { w: 1 };
        const offset = cropit.fixOffset({ x: -0.12121 });
        expect(offset.x).toBe(-0.12);
      });
    });

    describe('fixes y', () => {
      it('fits image to top if image height is less than preview', () => {
        cropit.imageSize = { h: 1 };
        cropit.zoom = 0.5;
        cropit.previewSize = { h: 1 };
        const offset = cropit.fixOffset({ y: -1 });
        expect(offset.y).toBe(0);
      });

      it('fits image to top', () => {
        cropit.imageSize = { h: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { h: 1 };
        const offset = cropit.fixOffset({ y: 1 });
        expect(offset.y).toBe(0);
      });

      it('fits image to bottom', () => {
        cropit.imageSize = { h: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { h: 1 };
        const offset = cropit.fixOffset({ y: -2 });
        expect(offset.y).toBe(-1);
      });

      it('rounds y', () => {
        cropit.imageSize = { h: 4 };
        cropit.zoom = 0.5;
        cropit.previewSize = { h: 1 };
        const offset = cropit.fixOffset({ y: -0.12121 });
        expect(offset.y).toBe(-0.12);
      });
    });
  });

  describe('#centerImage', () => {
    it('should center image', () => {
      cropit = newCropit();
      cropit.imageLoaded = true;
      cropit.imageSize = { w: 12, h: 8 };
      cropit.zoom = 0.5;
      cropit.previewSize = { w: 4, h: 2 };

      cropit.setOffset({ x: 0, y: 1 });
      expect(cropit.offset).not.toEqual({ x: -1, y: -1 });

      cropit.centerImage();
      expect(cropit.offset).toEqual({ x: -1, y: -1 });
    });
  });

  describe('#fixZoom', () => {
    it('returns zoomer.fixZoom()', () => {
      cropit = newCropit();

      cropit.zoomer = { fixZoom: () => 0.1 };
      expect(cropit.fixZoom()).toBe(0.1);

      cropit.zoomer = { fixZoom: () => 0.5 };
      expect(cropit.fixZoom()).toBe(0.5);

      cropit.zoomer = { fixZoom: () => 1 };
      expect(cropit.fixZoom()).toBe(1);
    });
  });

  describe('#isZoomable', () => {
    it('returns zoomer.isZoomable', () => {
      cropit = newCropit();

      cropit.zoomer = { isZoomable: () => true };
      expect(cropit.isZoomable()).toBe(true);

      cropit.zoomer = { isZoomable: () => false };
      expect(cropit.isZoomable()).toBe(false);
    });
  });

  describe('#getImageState', () => {
    it('returns image state', () => {
      cropit = newCropit();
      cropit.imageSrc = IMAGE_DATA;
      cropit.offset = { x: -1, y: -1 };
      cropit.zoom = 0.5;
      const imageState = cropit.getImageState();
      expect(imageState.src).toBe(IMAGE_DATA);
      expect(imageState.offset).toEqual({ x: -1, y: -1 });
      expect(imageState.zoom).toBe(0.5);
    });
  });

  describe('#getImageSrc', () => {
    it('returns image source', () => {
      cropit = newCropit();
      cropit.imageSrc = IMAGE_URL;
      expect(cropit.getImageSrc()).toBe(IMAGE_URL);
    });
  });

  describe('#getOffset', () => {
    it('returns offset', () => {
      cropit = newCropit();
      cropit.offset = { x: -2, y: -2 };
      expect(cropit.getOffset()).toEqual({ x: -2, y: -2 });
    });
  });

  describe('#getZoom', () => {
    it('returns zoom', () => {
      cropit = newCropit();
      cropit.zoom = 0.75;
      expect(cropit.getZoom()).toBe(0.75);
    });
  });

  describe('#getImageSize', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('returns image size', () => {
      cropit.imageSize = { w: 1, h: 1 };
      expect(cropit.getImageSize()).toEqual({ width: 1, height: 1 });
    });

    it('returns null when imageSize is absent', () => {
      expect(cropit.getImageSize()).toBe(null);
    });
  });

  describe('#getPreviewSize', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('returns preview size', () => {
      cropit.previewSize = { w: 1, h: 1 };
      expect(cropit.getPreviewSize()).toEqual({ width: 1, height: 1 });
    });
  });

  describe('#setPreviewSize', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('sets preview size', () => {
      cropit.previewSize = { w: 1, h: 1 };
      expect(cropit.previewSize).not.toEqual({ w: 2, h: 2 });

      cropit.setPreviewSize({ width: 2, height: 2 });
      expect(cropit.previewSize).toEqual({ w: 2, h: 2 });
    });

    it('updates zoomer if image is loaded', () => {
      cropit.imageLoaded = true;
      cropit.imageSize = { w: 2, h: 2 };
      cropit.offset = { x: 0, y: 0 };
      spyOn(cropit.zoomer, 'setup');
      cropit.setPreviewSize({ width: 1, height: 1 });
      expect(cropit.zoomer.setup).toHaveBeenCalled();
    });
  });
});
