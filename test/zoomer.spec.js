jest
  .dontMock('lodash')
  .dontMock('../src/options')
  .dontMock('../src/zoomer');

import _ from 'lodash';

import { loadDefaults } from '../src/options';
import Zoomer from '../src/zoomer';

const defaults = loadDefaults();

describe('Zoomer', () => {
  let zoomer = null;

  const setup = (options) => {
    zoomer.setup(_.extend({}, defaults, options));
  };

  beforeEach(() => {
    zoomer = new Zoomer();
  });

  describe('#setup', () => {
    it('sets minZoom to the larger of widthRatio and heightRatio in `fill` minZoom mode', () => {
      setup({
        imageSize: { width: 4, height: 2 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fill',
      });
      expect(zoomer.minZoom).toBe(0.5);

      setup({
        imageSize: { width: 2, height: 4 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fill',
      });
      expect(zoomer.minZoom).toBe(0.5);

      setup({
        imageSize: { width: 2, height: 2 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fill',
      });
      expect(zoomer.minZoom).toBe(0.5);
    });

    it('sets minZoom to the smaller of widthRatio and heightRatio `fit` minZoom mode', () => {
      setup({
        imageSize: { width: 4, height: 2 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fit',
      });
      expect(zoomer.minZoom).toBe(0.25);

      setup({
        imageSize: { width: 2, height: 4 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fit',
      });
      expect(zoomer.minZoom).toBe(0.25);

      setup({
        imageSize: { width: 2, height: 2 },
        previewSize: { width: 1, height: 1 },
        minZoom: 'fit',
      });
      expect(zoomer.minZoom).toBe(0.5);
    });

    it('sets minZoom to 1 if image is small and smallImage is allow', () => {
      setup({
        imageSize: { width: 1, height: 1 },
        previewSize: { width: 2, height: 2 },
        smallImage: 'allow',
      });
      expect(zoomer.minZoom).toBe(1);

      setup({
        imageSize: { width: 1, height: 3 },
        previewSize: { width: 2, height: 2 },
        minZoom: 'fill',
        smallImage: 'allow',
      });
      expect(zoomer.minZoom).toBe(1);
    });

    it('follows minZoom option for small images if smallImage is stretch', () => {
      setup({
        imageSize: { width: 2, height: 1 },
        previewSize: { width: 4, height: 4 },
        minZoom: 'fill',
        smallImage: 'stretch',
      });
      expect(zoomer.minZoom).toBe(4);

      setup({
        imageSize: { width: 2, height: 1 },
        previewSize: { width: 4, height: 4 },
        minZoom: 'fit',
        smallImage: 'stretch',
      });
      expect(zoomer.minZoom).toBe(2);
    });

    it('sets maxZoom to minZoom if image is smaller than preview', () => {
      setup({
        imageSize: { width: 4, height: 2 },
        previewSize: { width: 5, height: 5 },
      });
      expect(zoomer.maxZoom).toBe(zoomer.minZoom);
    });

    it('sets maxZoom to 1 if image is larger than preview', () => {
      setup({
        imageSize: { width: 4, height: 2 },
        previewSize: { width: 1, height: 1 },
      });
      expect(zoomer.maxZoom).toBe(1);
    });

    it('sets maxZoom to customized value', () => {
      setup({
        imageSize: { width: 4, height: 2 },
        previewSize: { width: 1, height: 1 },
        maxZoom: 1.5,
      });
      expect(zoomer.maxZoom).toBe(1.5);
    });

    it('scales maxZoom in inverse proportion to exportZoom', () => {
      setup({
        imageSize: { width: 8, height: 4 },
        previewSize: { width: 1, height: 1 },
        exportZoom: 2,
      });
      expect(zoomer.maxZoom).toBe(0.5);

      setup({
        imageSize: { width: 8, height: 4 },
        previewSize: { width: 1, height: 1 },
        exportZoom: 2,
        maxZoom: 1.5,
      });
      expect(zoomer.maxZoom).toBe(0.75);
    });
  });

  describe('#getZoom', () => {
    it('returns proper zoom level', () => {
      zoomer.minZoom = 0.5;
      zoomer.maxZoom = 1;

      expect(zoomer.getZoom(0)).toBe(0.5);
      expect(zoomer.getZoom(0.5)).toBe(0.75);
      expect(zoomer.getZoom(1)).toBe(1);
    });
  });

  describe('#getSliderPos', () => {
    it('returns proper slider pos', () => {
      zoomer.minZoom = 0.5;
      zoomer.maxZoom = 1;

      expect(zoomer.getSliderPos(0.5)).toBe(0);
      expect(zoomer.getSliderPos(0.75)).toBe(0.5);
      expect(zoomer.getSliderPos(1)).toBe(1);
    });

    it('returns 0 when minZoom and maxZoom are the same', () => {
      zoomer.minZoom = 2;
      zoomer.maxZoom = 2;

      expect(zoomer.getSliderPos(1)).toBe(0);
      expect(zoomer.getSliderPos(2)).toBe(0);
      expect(zoomer.getSliderPos(3)).toBe(0);
    });

    it('is inverse to getZoom', () => {
      zoomer.minZoom = Math.random();
      zoomer.maxZoom = Math.random() + zoomer.minZoom;
      _.range(10).map((x) => x / 10).forEach((sliderPos) => {
        const zoom = zoomer.getZoom(sliderPos);
        const calculatedSliderPos = zoomer.getSliderPos(zoom);
        expect(calculatedSliderPos).toBeGreaterThan(sliderPos - 0.0001);
        expect(calculatedSliderPos).toBeLessThan(sliderPos + 0.0001);
      });
    });
  });

  describe('#isZoomable', () => {
    it('returns true when image is bigger than preview', () => {
      setup({
        imageSize: { width: 2, height: 2 },
        previewSize: { width: 1, height: 1 },
      });
      expect(zoomer.isZoomable()).toBe(true);
    });

    it('returns false when image is the same size as preview', () => {
      setup({
        imageSize: { width: 1, height: 1 },
        previewSize: { width: 1, height: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image has the same width as preview', () => {
      setup({
        imageSize: { width: 1, height: 2 },
        previewSize: { width: 1, height: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image has the same height as preview', () => {
      setup({
        imageSize: { width: 2, height: 1 },
        previewSize: { width: 1, height: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image is smaller than preview', () => {
      setup({
        imageSize: { width: 1, height: 1 },
        previewSize: { width: 2, height: 2 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });
  });

  describe('fixZoom()', () => {
    beforeEach(() => {
      zoomer.minZoom = 0.5;
      zoomer.maxZoom = 1;
    });

    it('fixes zoom when it is too small', () => {
      expect(zoomer.fixZoom(0)).toBe(0.5);
      expect(zoomer.fixZoom(0.25)).toBe(0.5);
      expect(zoomer.fixZoom(0.49)).toBe(0.5);
    });

    it('fixes zoom when it is too large', () => {
      expect(zoomer.fixZoom(1.5)).toBe(1);
      expect(zoomer.fixZoom(1.1)).toBe(1);
    });

    it('keeps zoom when it is right', () => {
      expect(zoomer.fixZoom(0.5)).toBe(0.5);
      expect(zoomer.fixZoom(0.75)).toBe(0.75);
      expect(zoomer.fixZoom(1)).toBe(1);
    });
  });
});
