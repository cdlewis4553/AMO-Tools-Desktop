import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { LightingReplacementService, LightingReplacementData, LightingReplacementResults } from './lighting-replacement.service';
import { FormGroup } from '@angular/forms';
import { Directory, DirectoryTreeItem } from '../../../shared/models/directory';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-lighting-replacement',
  templateUrl: './lighting-replacement.component.html',
  styleUrls: ['./lighting-replacement.component.css']
})
export class LightingReplacementComponent implements OnInit {
  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;
  @ViewChild('contentContainer') contentContainer: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }
  headerHeight: number;
  currentField: string;
  tabSelect: string = 'results';
  settings: Settings;
  baselineData: Array<LightingReplacementData> = [{
    hoursPerDay: 0,
    daysPerMonth: 30,
    monthsPerYear: 12,
    hoursPerYear: 0,
    wattsPerLamp: 0,
    lampsPerFixture: 0,
    numberOfFixtures: 0,
    lumensPerLamp: 0,
    totalLighting: 0,
    electricityUse: 0
  }];
  baselineElectricityUse: number;
  modificationData: Array<LightingReplacementData> = [];
  modificationElectricityUse: number;
  baselineResults: LightingReplacementResults;
  modificationResults: LightingReplacementResults;
  baselineSelected: boolean = true;
  modifiedSelected: boolean = false;
  modificationExists: boolean = false;
  containerHeight: number;

  saveCalcForm: FormGroup;
  root: DirectoryTreeItem;
  openDirs: Array<Directory>;
  @ViewChild('saveCalcModal') public saveCalcModal: ModalDirective;

  constructor(private settingsDbService: SettingsDbService, private lightingReplacementService: LightingReplacementService) { }

  ngOnInit() {    
    this.root = {
      directory: this.lightingReplacementService.getRootDir(),
      expanded: true
    };
    this.saveCalcForm = this.lightingReplacementService.initForm();
    
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (this.lightingReplacementService.baselineData) {
      this.baselineData = this.lightingReplacementService.baselineData;
    }
    if (this.lightingReplacementService.modificationData) {
      this.modificationData = this.lightingReplacementService.modificationData;
      this.modificationExists = true;
    }
    this.calculate();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  ngOnDestroy() {
    this.lightingReplacementService.baselineData = this.baselineData;
    this.lightingReplacementService.modificationData = this.modificationData;
  }

  btnResetData() {
    this.baselineData = new Array<LightingReplacementResults>();
    this.modificationData = new Array<LightingReplacementResults>();
    let newBaselineData = {
      hoursPerDay: 0,
      daysPerMonth: 30,
      monthsPerYear: 12,
      hoursPerYear: 0,
      wattsPerLamp: 0,
      lampsPerFixture: 0,
      numberOfFixtures: 0,
      lumensPerLamp: 0,
      totalLighting: 0,
      electricityUse: 0
    }
    this.baselineData.push(newBaselineData);
    this.lightingReplacementService.baselineData = this.baselineData;
    this.lightingReplacementService.modificationData = this.modificationData;
    this.calculate();
  }

  togglePanel(bool: boolean) {
    if (bool == this.baselineSelected) {
      this.baselineSelected = true;
      this.modifiedSelected = false;
    }
    else if (bool == this.modifiedSelected) {
      this.modifiedSelected = true;
      this.baselineSelected = false;
    }
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.containerHeight = this.contentContainer.nativeElement.clientHeight - this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  changeField(str: string) {
    this.currentField = str;
  }

  calculate() {
    this.baselineData.forEach(data => {
      data = this.lightingReplacementService.calculate(data);
    })
    this.baselineResults = this.lightingReplacementService.getTotals(this.baselineData);
    this.modificationData.forEach(data => {
      data = this.lightingReplacementService.calculate(data);
    })
    this.modificationResults = this.lightingReplacementService.getTotals(this.modificationData);
  }

  addBaselineFixture() {
    this.baselineData.push({
      hoursPerDay: 0,
      daysPerMonth: 30,
      monthsPerYear: 12,
      hoursPerYear: 0,
      wattsPerLamp: 0,
      lampsPerFixture: 0,
      numberOfFixtures: 0,
      lumensPerLamp: 0,
      totalLighting: 0,
      electricityUse: 0
    });
    this.calculate();
  }

  removeBaselineFixture(index: number) {
    this.baselineData.splice(index, 1);
    this.calculate();

  }

  addModification() {
    this.modificationData = JSON.parse(JSON.stringify(this.baselineData));
    this.modificationExists = true;
    this.togglePanel(this.modifiedSelected);
  }


  addModificationFixture() {
    this.modificationData.push({
      hoursPerDay: 0,
      daysPerMonth: 30,
      monthsPerYear: 12,
      hoursPerYear: 0,
      wattsPerLamp: 0,
      lampsPerFixture: 0,
      numberOfFixtures: 0,
      lumensPerLamp: 0,
      totalLighting: 0,
      electricityUse: 0
    });
    this.calculate();
  }

  removeModificationFixture(index: number) {
    this.modificationData.splice(index, 1);
    this.calculate();
  }

  focusField(str: string) {
    this.currentField = str;
  }


  showSaveCalcModal(): void {
    this.saveCalcModal.show();
  }

  closeSaveCalcModal(reset: boolean): void {
    this.saveCalcModal.hide();
  }

  getPadding(dir: Directory, padding: number) {
    if (dir.parentDirectoryId !== null && dir.parentDirectoryId !== undefined) {
      console.log('')
      let tmpDir = this.lightingReplacementService.getDirectoryById(dir.parentDirectoryId);
      return this.getPadding(tmpDir, padding + 10);
    }
    else {
      console.log('returning padding = ' + padding);
      return "0px 0px 0px " + padding + "px";
    }
    
  }

  closeDirectory(dir: Directory) {

    // console.log('closing directory = ');
    // console.log(dir);
    if (dir.subDirectory !== undefined && dir.subDirectory !== null && dir.subDirectory.length > 0) {
      for (let i = 0; i < dir.subDirectory.length; i++) {
        let check = _.includes(this.openDirs, dir.subDirectory[i]);
        if (check) {
          this.closeDirectory(dir.subDirectory[i]);
        }
      }
    }
    // console.log('index of ' + dir.name + ' = ');
    let index = _.indexOf(this.openDirs, dir);
    // console.log(index);
    this.openDirs.splice(index);
  }

  openOrCloseDirectory(id: number) {
    let tmpDir = this.lightingReplacementService.getDirectoryById(id);
    console.log('tmpDir = ');
    console.log(tmpDir);
    let check = _.includes(this.openDirs, tmpDir);
    if (!check) {
      this.openDirs.push(tmpDir);
    }
    else {
      console.log('openDirs before closing = ');
      console.log(this.openDirs);
      this.closeDirectory(tmpDir);
      console.log('openDirs AFTER closing = ');
      console.log(this.openDirs);
      // if (tmpDir)
    }
  }
}


// [
//   rootDir,
//   [
//     child0, 
//     [
//       grandChild00,
//       [],
//       grandChild01,
//       [],
//     ],
//     child1, 
//     [
//       grandchild10,
//       [],
//       grandchild11,
//       [
//         greatgrandchild110,
//         [],
//         greatgrandchild111,
//         [],
//       ],
//     ],
//     child2,
//     [],
//   ],
// ]