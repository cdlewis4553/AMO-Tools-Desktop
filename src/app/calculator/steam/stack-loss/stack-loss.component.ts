import { Component, OnInit, ViewChild, Input, ElementRef, HostListener } from '@angular/core';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { Settings } from '../../../shared/models/settings';
import { FormGroup } from '../../../../../node_modules/@angular/forms';
import { FlueGasByVolume, FlueGasByMass } from '../../../shared/models/phast/losses/flueGas';
import { StackLossService } from './stack-loss.service';

@Component({
  selector: 'app-stack-loss-calculator',
  templateUrl: './stack-loss.component.html',
  styleUrls: ['./stack-loss.component.css']
})
export class StackLossComponent implements OnInit {
  @Input()
  settings: Settings;

  @ViewChild('leftPanelHeader', { static: false }) leftPanelHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  headerHeight: number;

  currentField: string = 'default';
  method: string = 'volume';
  tabSelect: string = 'results';
  stackLossForm: FormGroup;
  flueGasByVolume: FlueGasByVolume;
  flueGasByMass: FlueGasByMass;

  stackLossPercent: number = 0;
  boilerEfficiency: number = 0;

  constructor(private settingsDbService: SettingsDbService, private stackLossService: StackLossService) {
  }

  ngOnInit() {
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.resetForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }


  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  changeField(str: string) {
    this.currentField = str;
  }

  createExampleForm() {
    if (this.stackLossService.stackLossInput) {
      if (this.stackLossService.stackLossInput.flueGasType) {
        this.method = this.stackLossService.stackLossInput.flueGasType;
        if (this.method === 'volume') {
          this.stackLossForm = this.stackLossService.initByVolumeFormFromLoss(this.stackLossService.stackLossInput);
        } else if (this.method === 'mass') {
          this.stackLossForm = this.stackLossService.initByMassFormFromLoss(this.stackLossService.stackLossInput);
        }
      } else {
        if (this.method === 'volume') {
          this.stackLossForm = this.stackLossService.initFormVolume();
        } else if (this.method === 'mass') {
          this.stackLossForm = this.stackLossService.initFormMass();
        }
      }
    } else {
      if (this.method === 'volume') {
        this.stackLossForm = this.stackLossService.initFormVolume();
      } else if (this.method === 'mass') {
        this.stackLossForm = this.stackLossService.initFormMass();
      }
    }
  }

  resetForm() {
    if (this.stackLossService.stackLossInput) {
      if (this.stackLossService.stackLossInput.flueGasType) {
        this.method = this.stackLossService.stackLossInput.flueGasType;
        if (this.method === 'volume') {
          this.stackLossForm = this.stackLossService.initByVolumeFormFromLoss(this.stackLossService.stackLossInput);
        } else if (this.method === 'mass') {
          this.stackLossForm = this.stackLossService.initByMassFormFromLoss(this.stackLossService.stackLossInput);
        }
      } else {
        if (this.method === 'volume') {
          this.stackLossForm = this.stackLossService.initFormVolume();
        } else if (this.method === 'mass') {
          this.stackLossForm = this.stackLossService.initFormMass();
        }
      }
    } else {
      if (this.method === 'volume') {
        this.stackLossForm = this.stackLossService.initFormVolume();
      } else if (this.method === 'mass') {
        this.stackLossForm = this.stackLossService.initFormMass();
      }
    }
  }

  getForm() {
    if (this.method === 'volume') {
      if (this.stackLossService.stackLossInput.flueGasByVolume) {
        this.stackLossForm = this.stackLossService.initByVolumeFormFromLoss(this.stackLossService.stackLossInput);
      } else {
        this.stackLossForm = this.stackLossService.initFormVolume();
      }
    } else if (this.method === 'mass') {
      if (this.stackLossService.stackLossInput.flueGasByMass) {
        this.stackLossForm = this.stackLossService.initByMassFormFromLoss(this.stackLossService.stackLossInput);
      } else {
        this.stackLossForm = this.stackLossService.initFormMass();
      }
    }
  }

  calculate(form: FormGroup) {
    form.patchValue({
      fuelTemperature: this.stackLossForm.controls.combustionAirTemperature.value
    });
    if (this.method === "volume") {
      this.flueGasByVolume = this.stackLossService.buildByVolumeLossFromForm(form);
      this.stackLossService.stackLossInput.flueGasType = this.method;
      this.stackLossService.stackLossInput.flueGasByVolume = this.flueGasByVolume;
      if (form.status === 'VALID') {
        const availableHeat = this.stackLossService.flueGasByVolume(this.flueGasByVolume, this.settings);
        this.boilerEfficiency = availableHeat * 100;
        this.stackLossPercent = (1 - availableHeat) * 100;
      } else {
        this.stackLossPercent = 0;
        this.boilerEfficiency = 0;
      }
    } else if (this.method === "mass") {
      this.flueGasByMass = this.stackLossService.buildByMassLossFromForm(form);
      this.stackLossService.stackLossInput.flueGasType = this.method;
      this.stackLossService.stackLossInput.flueGasByMass = this.flueGasByMass;
      if (form.status === 'VALID') {
        const availableHeat = this.stackLossService.flueGasByMass(this.flueGasByMass, this.settings);
        this.boilerEfficiency = availableHeat * 100;
        this.stackLossPercent = (1 - availableHeat) * 100;
      } else {
        this.stackLossPercent = 0;
        this.boilerEfficiency = 0;
      }
    }
  }

  btnResetData() {
    this.stackLossService.stackLossInput = {
      flueGasType: undefined,
      flueGasByVolume: undefined,
      flueGasByMass: undefined
    };
    this.resetForm();
    this.calculate(this.stackLossForm);
  }

  btnGenerateData() {
    this.stackLossService.stackLossInput = {
      flueGasByMass: undefined,
      flueGasByVolume: {
        C2H6: 8.5,
        C3H8: 0,
        C4H10_CnH2n: 0,
        CH4: 87,
        CO: 0,
        CO2: 0.4,
        H2: 0.4,
        H2O: 0,
        N2: 3.6,
        O2: 0.1,
        SO2: 0,
        combustionAirTemperature: 80,
        excessAirPercentage: 15,
        flueGasTemperature: 320,
        fuelTemperature: 80,
        gasTypeId: 1,
        o2InFlueGas: 2.8570007028309443,
        oxygenCalculationMethod: "Excess Air"
      },
      flueGasType: "volume"
    };
    this.createExampleForm();
    this.calculate(this.stackLossForm);
  }
}
