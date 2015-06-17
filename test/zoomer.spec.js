jest
  .dontMock('lodash')
  .dontMock('../src/zoomer');

import _ from 'lodash';

import Zoomer from '../src/zoomer';

describe('Zoomer', () => {
  let zoomer = null;

  beforeEach(() => {
    zoomer = new Zoomer();
  });

  describe('#setup', () => {
    it('sets minZoom to the larger of widthRatio and heightRatio in `fill` minZoom mode', () => {
      zoomer.setup({
        imageSize: { w: 4, h: 2 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.minZoom).toBe(0.5);

      zoomer.setup({
        imageSize: { w: 2, h: 4 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.minZoom).toBe(0.5);

      zoomer.setup({
        imageSize: { w: 2, h: 2 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.minZoom).toBe(0.5);
    });

    it('sets minZoom to the smaller of widthRatio and heightRatio `fit` minZoom mode', () => {
      zoomer.setup({
        imageSize: { w: 4, h: 2 },
        previewSize: { w: 1, h: 1 },
        minZoom: 'fit'
      });
      expect(zoomer.minZoom).toBe(0.25);

      zoomer.setup({
        imageSize: { w: 2, h: 4 },
        previewSize: { w: 1, h: 1 },
        minZoom: 'fit'
      });
      expect(zoomer.minZoom).toBe(0.25);

      zoomer.setup({
        imageSize: { w: 2, h: 2 },
        previewSize: { w: 1, h: 1 },
        minZoom: 'fit'
      });
      expect(zoomer.minZoom).toBe(0.5);
    });

    it('sets maxZoom to minZoom if image is smaller than preview', () => {
      zoomer.setup({
        imageSize: { w: 4, h: 2 },
        previewSize: { w: 5, h: 5 },
      });
      expect(zoomer.maxZoom).toBe(zoomer.minZoom);
    });

    it('sets maxZoom to 1 if image is larger than preview', () => {
      zoomer.setup({
        imageSize: { w: 4, h: 2 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.maxZoom).toBe(1);
    });

    it('sets maxZoom to customized value', () => {
      zoomer.setup({
        imageSize: { w: 4, h: 2 },
        previewSize: { w: 1, h: 1 },
        maxZoom: 1.5,
      });
      expect(zoomer.maxZoom).toBe(1.5);
    });

    it('scales maxZoom in inverse proportion to exportZoom', () => {
      zoomer.setup({
        imageSize: { w: 8, h: 4 },
        previewSize: { w: 1, h: 1 },
        exportZoom: 2,
      });
      expect(zoomer.maxZoom).toBe(0.5);

      zoomer.setup({
        imageSize: { w: 8, h: 4 },
        previewSize: { w: 1, h: 1 },
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
      zoomer.setup({
        imageSize: { w: 2, h: 2 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.isZoomable()).toBe(true);
    });

    it('returns false when image is the same size as preview', () => {
      zoomer.setup({
        imageSize: { w: 1, h: 1 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image has the same width as preview', () => {
      zoomer.setup({
        imageSize: { w: 1, h: 2 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image has the same height as preview', () => {
      zoomer.setup({
        imageSize: { w: 2, h: 1 },
        previewSize: { w: 1, h: 1 },
      });
      expect(zoomer.isZoomable()).toBe(false);
    });

    it('returns false when image is smaller than preview', () => {
      zoomer.setup({
        imageSize: { w: 1, h: 1 },
        previewSize: { w: 2, h: 2 },
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
