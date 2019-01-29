import { Component, OnInit, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { LightingReplacementService } from './lighting-replacement.service';
import { LightingReplacementData, LightingReplacementResults, LightingReplacement } from '../lighting-replacement';
import { FormGroup } from '@angular/forms';
import { Directory, DirectoryTreeItem } from '../../../shared/models/directory';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { CalculatorDbService } from '../../../indexedDb/calculator-db.service';
import { Calculator } from '../../../shared/models/calculators';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-lighting-replacement',
  templateUrl: './lighting-replacement.component.html',
  styleUrls: ['./lighting-replacement.component.css']
})
export class LightingReplacementComponent implements OnInit {
  //assuming I'll need some or all of these inputs for loading calculator from a card in a directory
  @Input()
  calculator: Calculator;
  @Input()
  directory: Directory;
  @Input()
  inDirectory: boolean;
  @Input()
  lightingReplacement: LightingReplacement;

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

  root: DirectoryTreeItem;
  // selectedDir: DirectoryTreeItem;
  selectedDir: Directory;
  openDirs: Array<Directory>;

  //add functionality for saving
  saveCalcForm: FormGroup;
  lightingReplacements: Array<LightingReplacement>;
  calcExists: boolean;
  saving: boolean;
  nameIndex: number = 1;
  @ViewChild('saveCalcModal') public saveCalcModal: ModalDirective;

  constructor(private settingsDbService: SettingsDbService, private lightingReplacementService: LightingReplacementService,
    private indexedDbService: IndexedDbService, private calculatorDbService: CalculatorDbService) { }

  ngOnInit() {

    //trying to establish root directory for file tree, can either be the directory supplied to the component
    // or the actual root directory of the whole app's file system
    this.root = {
      directory: this.directory !== null ? this.directory : this.lightingReplacementService.getRootDir(),
      expanded: true,
      selected: true
    };
    this.selectedDir = this.root.directory;

    //need to create form for saving from the file-tree browser
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
    if (this.inDirectory) {
      this.saveCalculator();
    }
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

  selectDir(id: number) {
    this.selectedDir = this.lightingReplacementService.getDirectoryById(id);
  }




  //============ start calculator saving methods ===========
  getCalculator() {
    let directoryCalcs = this.calculatorDbService.getByDirectoryId(this.directory.id);

    //not sure if I need to loop through all calculators in the directory and look for the desired lighting replacement calc
    for (let i = 0; i < directoryCalcs.length; i++) {
      if (directoryCalcs[i] !== undefined && directoryCalcs[i] !== null && directoryCalcs[i].lightingReplacements) {

        //I think I need to se this.calculator here
      }
    }

    //if calculator was found/supplied to component, enter this branch
    if (this.calculator) {
      this.calcExists = true;
      if (this.calculator.lightingReplacements) {
        this.lightingReplacements = this.calculator.lightingReplacements;
      } else {
        this.calculator.lightingReplacements = new Array<LightingReplacement>();
        this.lightingReplacements = this.calculator.lightingReplacements;
        // this.addLightingReplacement();
        this.saveCalculator();
      }
    } 
    //otherwise need to init a new calculator?
    else {
      this.calculator = this.initCalculator();
      this.lightingReplacements = this.calculator.lightingReplacements;
      // this.addLightingReplacement();
      this.saveCalculator();
    }
  }

  //based off of pre-assessment.component.ts initCalculator()
  initCalculator(): Calculator {
    let tmpLightingReplacement: LightingReplacement = {
      name: 'Lighting Calculator ' + this.nameIndex,
      baselineData: this.baselineData,
      modificationData: this.modificationData || null,
      baselineResults: this.baselineResults,
      modificationResults: this.modificationResults || null
    };
    let tmpLightingReplacements: Array<LightingReplacement> = new Array<LightingReplacement>();
    tmpLightingReplacements.push(tmpLightingReplacement);
    let tmpCalculator: Calculator = {
      lightingReplacements: tmpLightingReplacements
    }
    return tmpCalculator;
  }

  //based off of pre-assessment.component.ts saveCalculator()
  saveCalculator() {
    if (!this.saving || this.calcExists) {
      if (this.calcExists) {
        this.indexedDbService.putCalculator(this.calculator).then(() => {
          this.calculatorDbService.setAll();
        });
      } else {
        this.saving = true;
        //figured I don't need assessment ID's sense we're only tying to directory
        // this.calculator.assessmentId = this.assessment.id;
        this.indexedDbService.addCalculator(this.calculator).then((result) => {
          this.calculatorDbService.setAll().then(() => {
            this.calculator.id = result;
            this.calcExists = true;
            this.saving = false;
          })
        });
      }
    }
  }
}