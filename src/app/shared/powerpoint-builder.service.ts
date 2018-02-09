import { Injectable } from '@angular/core';
import * as pptx from 'pptxgenjs';
import * as docx from 'docxtemplater';
@Injectable()
export class PowerpointBuilderService {


  pptx: any;
  slide: any;
  docx: any;
  constructor() { }

  init() {
    this.pptx = new pptx;
  }

  initDocX(){
    this.docx = new docx;
    debugger
    console.log(this.docx);
    // docx.setData({
    //   first_name: 'Mark',
    //   last_name: 'Root'
    // })
    // docx.render();
    // let out = docx.getZip().generate({
    //   type:"blob",
    //   mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // })
    // console.log(out);
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
