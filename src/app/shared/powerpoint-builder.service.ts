import { Injectable } from '@angular/core';
import * as pptx from 'pptxgenjs';
@Injectable()
export class PowerpointBuilderService {


  pptx: any;
  slide: any;
  constructor() { }

  init() {
    this.pptx = new pptx;
  }


  addSlide(elementId) {
    this.slide = this.pptx.addNewSlide();
    this.pptx.addSlidesForTable(elementId);
  }

  save() {
    this.pptx.save('jszip', this.saveCallback, 'blob');
  }
  saveCallback(callbackArgs) {
    var blobUrl = window.URL.createObjectURL(callbackArgs);
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = blobUrl;
    link.download = "jsPowerpoint.ppt";
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  }
}
