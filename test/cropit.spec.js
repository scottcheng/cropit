jest
  .dontMock('jquery')
  .dontMock('../src/constants')
  .dontMock('../src/options')
  .dontMock('../src/cropit');

import $ from 'jquery';
import { ERRORS } from '../src/constants';
import options from '../src/options';
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

    options.values.forEach((o) => {
      expect(cropit.options[o.name]).toBe(o.default);
    });
  });

  describe('#init', () => {
    it('calls loadImage if image source is present', () => {
      cropit = newCropit({ imageState: { src: IMAGE_URL } });
      spyOn(cropit, 'loadImage');

      cropit.init();
      expect(cropit.loadImage).toHaveBeenCalled();
    });

    it('enables cross origin image source if allowCrossOrigin is set in options', () => {
      cropit = newCropit({ allowCrossOrigin: true });
      expect(cropit.image.crossOrigin).toBe('Anonymous');
    });

    it('disables cross origin image source if allowCrossOrigin is not set in options', () => {
      cropit = newCropit();
      expect(cropit.image.crossOrigin).not.toBe('Anonymous');
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
  });

  describe('#loadImage', () => {
    beforeEach(() => {
      cropit = newCropit();
    });

    it('sets test image source', () => {
      expect(cropit.preImage.src).not.toBe(IMAGE_DATA);

      cropit.loadImage(IMAGE_DATA);
      expect(cropit.preImage.src).toBe(IMAGE_DATA);
    });
  });

  describe('#onPreImageLoaded', () => {
    describe('reject small images', () => {
      beforeEach(() => {
        cropit = newCropit({ smallImage: 'reject' });
      });

      it('rejects image where image width is smaller than preview width', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.preImage = { width: 1, height: 3 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalled();
      });

      it('rejects image where image height is smaller than preview height', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.preImage = { width: 3, height: 1 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });

      it('does not reject image if it is larger than preview', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.preImage = { width: 3, height: 3 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('reject small images and exportZoom is not 1', () => {
      beforeEach(() => {
        cropit = newCropit({ smallImage: 'reject', exportZoom: 2 });
      });

      it('rejects image if image is smaller than preview after applying exportZoom', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.preImage = { width: 3, height: 3 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('reject small images and maxZoom is not 1', () => {
      beforeEach(() => {
        cropit = newCropit({ smallImage: 'reject', maxZoom: 2 });
      });

      it('does not reject image if maxZoom allows image to be zoomed beyond preview', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 4, h: 4 };
        cropit.preImage = { width: 3, height: 3 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalledWith(ERRORS.SMALL_IMAGE);
      });
    });

    describe('allow small images', () => {
      beforeEach(() => {
        cropit = newCropit({ smallImage: 'allow' });
      });

      it('does not reject small image', () => {
        spyOn(cropit, 'onImageError');
        cropit.previewSize = { w: 2, h: 2 };
        cropit.preImage = { width: 1, height: 1 };
        cropit.onPreImageLoaded();
        expect(cropit.onImageError).not.toHaveBeenCalled();
      });
    });

    it('sets image.src if everything passes', () => {
      cropit = newCropit();
      cropit.preImage = { src: IMAGE_DATA };
      expect(cropit.image.src).not.toBe(IMAGE_DATA);

      cropit.onPreImageLoaded();
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

    it('sets zoom to 1 if initialZoom is image', () => {
      cropit = newCropit({ initialZoom: 'image' });
      expect(cropit.zoom).not.toBe(1);

      cropit.image = { width: 2, height: 2 };
      cropit.previewSize = { w: 1, h: 1 };
      cropit.onImageLoaded();
      expect(cropit.zoom).toBe(1);
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
