import { Component, OnInit, ViewChild, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ElectronService } from 'ngx-electron';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ImportExportService } from '../shared/import-export/import-export.service';
import { AssessmentService } from '../assessment/assessment.service';
import * as pptx from 'pptxgenjs';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})

export class CoreComponent implements OnInit {
  showUpdateModal: boolean;

  @ViewChild('updateModal') public updateModal: ModalDirective;

  gettingData: boolean = false;
  showFeedback: boolean = true;

  showScreenshot: boolean = true;
  constructor(private electronService: ElectronService, private toastyService: ToastyService,
    private toastyConfig: ToastyConfig, private importExportService: ImportExportService, private assessmentService: AssessmentService, private changeDetectorRef: ChangeDetectorRef) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.limit = 1;
  }

  ngOnInit() {
    let test = new pptx;
    let slide = test.addNewSlide()
    slide.addText(
      'BONJOUR - CIAO - GUTEN TAG - HELLO - HOLA - NAMASTE - OLÀ - ZDRAS-TVUY-TE - こんにちは - 你好',
      { x: 0.0, y: 0.25, w: '100%', h: 1.5, align: 'c', font_size: 24, color: '0088CC', fill: 'F1F1F1' }
    );

  //  slide = test.addNewSlide();

    // Chart Type: BAR
    // var dataChartBar = [
    //   {
    //     name: 'Region 1',
    //     labels: ['May', 'June', 'July', 'August'],
    //     values: [26, 53, 100, 75]
    //   },
    //   {
    //     name: 'Region 2',
    //     labels: ['May', 'June', 'July', 'August'],
    //     values: [43.5, 70.3, 90.1, 80.05]
    //   }
    // ];
    // slide.addChart(test.charts.BAR, dataChartBar, { x: 1.0, y: 1.0, w: 12, h: 6 });

    let saveCallback = (callbackArgs) => {
      var blobUrl = window.URL.createObjectURL(callbackArgs);
      var link = document.createElement("a"); // Or maybe get it from the current document
      link.href = blobUrl;
      link.download = "aDefaultFileName.ppt";
      link.innerHTML = "Click here to download the file";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      //let blob = this.importExportService.dataURItoBlob(callbackArgs);

    }
    test.save('jszip', saveCallback, 'blob');
    //test.save('Node_Demo', function(filename){ debugger; console.log('Created: '+filename); });
    this.electronService.ipcRenderer.once('available', (event, arg) => {
      if (arg == true) {
        this.showUpdateModal = true;
        this.assessmentService.updateAvailable.next(true);
        this.changeDetectorRef.detectChanges();
      }
    })

    //send signal to main.js to check for update
    this.electronService.ipcRenderer.send('ready', null);

    this.importExportService.toggleDownload.subscribe((val) => {
      if (val == true) {
        this.downloadData();
      }
    })
    if (this.electronService.process.platform == 'win32') {
      this.showScreenshot = false;
    }

    this.assessmentService.showFeedback.subscribe(val => {
      this.showFeedback = val;
    })
  }

  takeScreenShot() {
    this.importExportService.takeScreenShot();
  }

  hideFeedback() {
    this.showFeedback = false;
  }

  downloadData() {
    this.gettingData = true;
    this.importExportService.initAllDirectories().then((allDirs) => {
      this.importExportService.selectedItems = new Array<any>();
      this.importExportService.getSelected(allDirs);
      setTimeout(() => {
        this.importExportService.exportData = new Array();
        this.importExportService.selectedItems.forEach(item => {
          this.importExportService.getAssessmentSettings(item);
        })
        setTimeout(() => {
          this.gettingData = false;
          this.importExportService.downloadData(this.importExportService.exportData);
        }, 1000)
      }, 500)
    });
  }

  mailTo() {
    this.importExportService.openMailTo();
  }

  closeModal() {
    this.showUpdateModal = false;
  }

}
