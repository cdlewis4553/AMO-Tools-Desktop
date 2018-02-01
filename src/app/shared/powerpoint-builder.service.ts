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


  addSlide() {
    this.slide = this.pptx.addNewSlide();
    // this.slide.addText(
    //   'BONJOUR - CIAO - GUTEN TAG - HELLO - HOLA - NAMASTE - OLÀ - ZDRAS-TVUY-TE - こんにちは - 你好',
    //   { x: 0.0, y: 0.25, w: '100%', h: 1.5, align: 'c', font_size: 24, color: '0088CC', fill: 'F1F1F1' }
    // );

    let rows = new Array();
    rows.push(['col 1', 'col 2', 'col 3']);
    rows.push([1, 2, 3]);
    this.slide.addTable(rows, { x: 0.5, y: 1, w: 9 })
  }

  save() {
    this.pptx.save('jszip', this.saveCallback, 'blob');
    //test.save('Node_Demo', function(filename){ debugger; console.log('Created: '+filename); });
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
