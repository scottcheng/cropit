class Zoomer {
  constructor() {
    this.minZoom = this.maxZoom = 1;
  }

  setup({ imageSize, previewSize, exportZoom, maxZoom, minZoom, smallImage }) {
    const widthRatio = previewSize.width / imageSize.width;
    const heightRatio = previewSize.height / imageSize.height;

    if (minZoom === 'fit') {
      this.minZoom = Math.min(widthRatio, heightRatio);
    }
    else {
      this.minZoom = Math.max(widthRatio, heightRatio);
    }

    if (smallImage === 'allow') {
      this.minZoom = Math.min(this.minZoom, 1);
    }

    this.maxZoom = Math.max(this.minZoom, maxZoom / exportZoom);
  }

  getZoom(sliderPos) {
    if (!this.minZoom || !this.maxZoom) { return null; }

    return sliderPos * (this.maxZoom - this.minZoom) + this.minZoom;
  }

  getSliderPos(zoom) {
    if (!this.minZoom || !this.maxZoom) { return null; }

    if (this.minZoom === this.maxZoom) {
      return 0;
    }
    else {
      return (zoom - this.minZoom) / (this.maxZoom - this.minZoom);
    }
  }

  isZoomable() {
    if (!this.minZoom || !this.maxZoom) { return null; }

    return this.minZoom !== this.maxZoom;
  }

  fixZoom(zoom) {
    return Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }
}

export default Zoomer;
