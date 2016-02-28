jest
  .dontMock('fs')
  .dontMock('jquery')
  .dontMock('../src/constants')
  .dontMock('../src/cropit')
  .dontMock('../src/plugin');

import fs from 'fs';
import $ from 'jquery';

import { CLASS_NAMES, PLUGIN_KEY } from '../src/constants';
import Cropit from '../src/cropit';
import '../src/plugin';

const IMAGE_DATA = 'data:image/png;base64,image-data...';

const FIXTURES = {
  BASIC: fs.readFileSync('./test/fixtures/basic.html').toString(),
  IMAGE_BACKGROUND: fs.readFileSync('./test/fixtures/image-background.html').toString(),
};

let $el = null;
let cropit = null;

describe('Cropit View', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = FIXTURES.BASIC;
    $el = $('.image-editor');
  });

  describe('basic', () => {
    describe('#init', () => {
      it('sets preview size from options', () => {
        const $preview = $el.find(`.${CLASS_NAMES.PREVIEW}`);
        $preview.css({ width: 1, height: 1 });
        expect($preview.width()).not.toBe(2);
        expect($preview.height()).not.toBe(2);

        $el.cropit({ width: 2, height: 2 });
        expect($preview.width()).toBe(2);
        expect($preview.height()).toBe(2);
      });

      it('sets min, max and step attributes on zoom slider', () => {
        const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);
        $zoomSlider.attr({ min: 2, max: 3, step: 0.5 });
        expect($zoomSlider.attr('min')).not.toBe('0');
        expect($zoomSlider.attr('max')).not.toBe('1');
        expect($zoomSlider.attr('step')).not.toBe('0.01');

        $el.cropit();
        expect($zoomSlider.attr('min')).toBe('0');
        expect($zoomSlider.attr('max')).toBe('1');
        expect($zoomSlider.attr('step')).toBe('0.01');
      });
    });

    describe('#onFileChange', () => {
      it('is invoked when file input changes', () => {
        spyOn(Cropit.prototype, 'onFileChange');
        $el.cropit();
        const $fileInput = $el.find(`.${CLASS_NAMES.FILE_INPUT}`);

        $fileInput.trigger('change');
        expect(Cropit.prototype.onFileChange).toHaveBeenCalled();
      });

      it('calls options.onFileChange', () => {
        const onFileChangeCallback = jasmine.createSpy('onFileChange callback');
        $el.cropit({ onFileChange: onFileChangeCallback });
        cropit = $el.data(PLUGIN_KEY);

        cropit.onFileChange();
        expect(onFileChangeCallback).toHaveBeenCalled();
      });
    });

    describe('#loadImage', () => {
      it('calls options.onImageLoading', () => {
        const onImageLoadingCallback = jasmine.createSpy('onImageLoading callback');
        $el.cropit({ onImageLoading: onImageLoadingCallback });
        cropit = $el.data(PLUGIN_KEY);

        cropit.loadImage(IMAGE_DATA);
        expect(onImageLoadingCallback).toHaveBeenCalled();
      });
    });

    describe('#onImageLoaded', () => {
      describe('with imageSrc', () => {
        beforeEach(() => {
          $el.cropit({ width: 1, height: 1 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.image = { src: IMAGE_DATA };
        });

        it('sets preview image', () => {
          const $image = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE}`);
          expect($image.attr('src')).not.toBe(IMAGE_DATA);

          cropit.onImageLoaded();
          expect($image.attr('src')).toBe(IMAGE_DATA);
        });

        it('sets up zoomer', () => {
          spyOn(cropit.zoomer, 'setup');

          cropit.onImageLoaded();
          expect(cropit.zoomer.setup).toHaveBeenCalled();
        });

        it('updates zoom slider', () => {
          const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);
          $zoomSlider.val(1);
          cropit.zoomer.getSliderPos = () => 0.5;
          expect(Number($zoomSlider.val())).not.toBe(0.5);

          cropit.onImageLoaded();
          expect(Number($zoomSlider.val())).toBe(0.5);
        });
      });

      it('calls options.onImageLoaded', () => {
        const onImageLoadedCallback = jasmine.createSpy('onImageLoaded callback');
        $el.cropit({ width: 1, height: 1, onImageLoaded: onImageLoadedCallback });
        cropit = $el.data(PLUGIN_KEY);

        cropit.onImageLoaded();
        expect(onImageLoadedCallback).toHaveBeenCalled();
      });
    });

    describe('#onImageError', () => {
      it('calls options.onImageError', () => {
        const onImageError = jasmine.createSpy('onImageLoaded callback');
        $el.cropit({ onImageError: onImageError });
        cropit = $el.data(PLUGIN_KEY);

        cropit.onImageError();
        expect(onImageError).toHaveBeenCalled();
      });
    });

    describe('#onPreviewEvent', () => {
      describe('mouse event', () => {
        it('is invoked on mousedown on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('mousedown');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('is invoked on mouseup on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('mouseup');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('is invoked on mouseleave on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('mouseleave');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('binds onMove on mousedown', () => {
          $el.cropit({ width: 2, height: 2 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.imageLoaded = true;
          cropit.image = { width: 8, height: 6 };

          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          spyOn(Cropit.prototype, 'onMove');
          cropit.onPreviewEvent({
            type: 'mousedown',
            stopPropagation: () => {},
          });

          $imageContainer.trigger('mousemove');
          expect(Cropit.prototype.onMove).toHaveBeenCalled();
        });

        it('moves image by dragging', () => {
          $el.cropit({ width: 2, height: 2 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.imageLoaded = true;
          cropit.image = { width: 8, height: 6 };
          cropit._zoom = 1;
          cropit._offset = { x: 0, y: 0 };

          cropit.onPreviewEvent({
            type: 'touchstart',
            clientX: -1,
            clientY: -1,
            stopPropagation: () => {},
          });

          cropit.onMove({
            type: 'touchmove',
            clientX: -3,
            clientY: -2,
            stopPropagation: () => {},
          });

          expect(cropit.offset).toEqual({ x: -2, y: -1 });
        });
      });

      describe('touch event', () => {
        it('is invoked on touchstart on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('touchstart');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('is invoked on touchend on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('touchend');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('is invoked on touchcancel on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('touchcancel');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('is invoked on touchleave on image container', () => {
          spyOn(Cropit.prototype, 'onPreviewEvent');
          $el.cropit();
          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          $imageContainer.trigger('touchleave');
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled();
        });

        it('binds onMove on touchstart', () => {
          $el.cropit({ width: 2, height: 2 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.imageLoaded = true;
          cropit.image = { width: 8, height: 6 };

          const $imageContainer = $el.find(`.${CLASS_NAMES.PREVIEW_IMAGE_CONTAINER}`);

          spyOn(Cropit.prototype, 'onMove');
          cropit.onPreviewEvent({
            type: 'touchstart',
            stopPropagation: () => {},
          });

          $imageContainer.trigger('touchmove');
          expect(Cropit.prototype.onMove).toHaveBeenCalled();
        });

        it('moves image by dragging', () => {
          $el.cropit({ width: 2, height: 2 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.imageLoaded = true;
          cropit.image = { width: 8, height: 6 };
          cropit._zoom = 1;
          cropit._offset = { x: 0, y: 0 };

          cropit.onPreviewEvent({
            type: 'touchstart',
            clientX: -1,
            clientY: -1,
            stopPropagation: () => {},
          });

          cropit.onMove({
            type: 'touchmove',
            clientX: -3,
            clientY: -2,
            stopPropagation: () => {},
          });

          expect(cropit.offset).toEqual({ x: -2, y: -1 });
        });
      });
    });

    describe('#onZoomSliderChange', () => {
      it('is invoked mousemove on zoom slider', () => {
        spyOn(Cropit.prototype, 'onZoomSliderChange');
        $el.cropit();
        const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);

        $zoomSlider.trigger('mousemove');
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled();
      });

      it('is invoked touchmove on zoom slider', () => {
        spyOn(Cropit.prototype, 'onZoomSliderChange');
        $el.cropit();
        const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);

        $zoomSlider.trigger('touchmove');
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled();
      });

      it('is invoked change on zoom slider', () => {
        spyOn(Cropit.prototype, 'onZoomSliderChange');
        $el.cropit();
        const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);

        $zoomSlider.trigger('change');
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled();
      });

      describe('when invoked', () => {
        beforeEach(() => {
          $el.cropit({ width: 2, height: 2 });
          cropit = $el.data(PLUGIN_KEY);
          cropit.image = { width: 8, height: 6 };
          cropit._zoom = 1;
          cropit.imageLoaded = true;
          cropit.setZoom = () => {};
        });

        it('updates zoomSliderPos', () => {
          cropit.zoomSliderPos = 0;
          expect(cropit.zoomSliderPos).not.toBe(1);

          const $zoomSlider = $el.find(`.${CLASS_NAMES.ZOOM_SLIDER}`);
          $zoomSlider.val(1);
          cropit.onZoomSliderChange();
          expect(cropit.zoomSliderPos).toBe(1);
        });
      });
    });
  });

  describe('with background image', () => {
    beforeEach(() => {
      document.documentElement.innerHTML = FIXTURES.IMAGE_BACKGROUND;
      $el = $('.image-editor');
    });

    describe('#init', () => {
      it('inserts background image', () => {
        $el.cropit({ width: 1, height: 1, imageBackground: true });
        const $imageBg = $el.find(`.${CLASS_NAMES.PREVIEW_BACKGROUND}`);
        expect($imageBg.length).toBeTruthy();
      });

      it('inserts background image container', () => {
        $el.cropit({ width: 1, height: 1, imageBackground: true });
        const $imageBgContainer = $el.find(`.${CLASS_NAMES.PREVIEW_BACKGROUND_CONTAINER}`);
        expect($imageBgContainer.length).toBeTruthy();
        expect($imageBgContainer.css('position')).toBe('absolute');
      });
    });

    describe('#onImageLoaded', () => {
      it('updates background image source', () => {
        $el.cropit({ width: 1, height: 1, imageBackground: true });
        cropit = $el.data(PLUGIN_KEY);
        cropit.image = { src: IMAGE_DATA };
        const $imageBg = $el.find(`.${CLASS_NAMES.PREVIEW_BACKGROUND}`);
        expect($imageBg.attr('src')).not.toBe(IMAGE_DATA);

        cropit.onImageLoaded();
        expect($imageBg.attr('src')).toBe(IMAGE_DATA);
      });
    });
  });
});
