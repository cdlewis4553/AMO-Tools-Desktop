import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from "@angular/forms";
import { Settings } from "../../../shared/models/settings";
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { SteamPropertiesInput } from '../../../shared/models/steam/steam-inputs';
import { SteamService } from '../steam.service';
import { SteamPropertiesOutput } from '../../../shared/models/steam/steam-outputs';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';


@Component({
  selector: 'app-steam-properties-calculator',
  templateUrl: './steam-properties.component.html',
  styleUrls: ['./steam-properties.component.css']
})
export class SteamPropertiesComponent implements OnInit {
  @Input()
  settings: Settings;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getChartHeight();
    this.getChartWidth();
    this.resizeTabs();
  }


  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;
  headerHeight: number;

  @ViewChild('lineChartContainer') lineChartContainer: ElementRef;
  chartContainerHeight: number;
  chartContainerWidth: number;

  steamPropertiesForm: FormGroup;
  steamPropertiesOutput: SteamPropertiesOutput;
  tabSelect: string = 'results';
  currentField: string = 'pressure';
  graphToggle: string = '0';
  graphToggleForm: FormGroup;
  data: { pressure: number, thermodynamicQuantity: number, temperature: number, enthalpy: number, entropy: number, volume: number };

  plotReady: boolean = false;
  ranges: { minPressure: number, maxPressure: number, minQuantityValue: number, maxQuantityValue: number };
  toggleResetData: boolean = false;
  constructor(private formBuilder: FormBuilder, private convertUnitsService: ConvertUnitsService, private settingsDbService: SettingsDbService, private changeDetectorRef: ChangeDetectorRef, private steamService: SteamService) { }

  ngOnInit() {
    this.graphToggleForm = this.formBuilder.group({
      'graphToggle': [0, Validators.required]
    });

    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    this.steamPropertiesOutput = this.getEmptyResults();
    this.getForm(0);
    this.calculate(this.steamPropertiesForm);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getChartWidth();
      this.getChartHeight();
      this.changeDetectorRef.detectChanges();
    }, 50);
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  btnResetData() {
    this.steamService.steamPropertiesInput = null;
    this.steamPropertiesOutput = this.getEmptyResults();
    this.getForm(0);
    this.calculate(this.steamPropertiesForm);
    this.toggleResetData = !this.toggleResetData;
  }

  getForm(quantityValue: number) {
    if (this.steamService.steamPropertiesInput) {
      this.ranges = this.getRanges(quantityValue, this.steamService.steamPropertiesInput.pressure);
      let quantityValueValidators: Array<ValidatorFn> = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
      // if (this.steamService.steamPropertiesInput.thermodynamicQuantity != 0) {
      //   quantityValueValidators = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
      // }
      this.steamPropertiesForm = this.formBuilder.group({
        'pressure': [this.steamService.steamPropertiesInput.pressure, [Validators.required, Validators.min(this.ranges.minPressure), Validators.max(this.ranges.maxPressure)]],
        'thermodynamicQuantity': [this.steamService.steamPropertiesInput.thermodynamicQuantity, Validators.required],
        'quantityValue': [this.steamService.steamPropertiesInput.quantityValue, quantityValueValidators]
      });
    } else {
      this.ranges = this.getRanges(quantityValue, 0);
      let quantityValueValidators: Array<ValidatorFn> = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
      // if (quantityValue != 0) {
      //   quantityValueValidators = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
      // }
      this.steamPropertiesForm = this.formBuilder.group({
        'pressure': ['', [Validators.required, Validators.min(this.ranges.minPressure), Validators.max(this.ranges.maxPressure)]],
        'thermodynamicQuantity': [quantityValue, Validators.required],
        'quantityValue': ['', quantityValueValidators]
      });
    }
  }

  updateForm() {
    this.ranges = this.getRanges(this.steamPropertiesForm.controls.thermodynamicQuantity.value, this.steamPropertiesForm.controls.pressure.value);
    let quantityValueValidators: Array<ValidatorFn> = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
    // if (this.steamPropertiesForm.controls.thermodynamicQuantity.value != 0) {
    //   quantityValueValidators = [Validators.required, Validators.min(this.ranges.minQuantityValue), Validators.max(this.ranges.maxQuantityValue)];
    // }
    this.steamPropertiesForm.controls.quantityValue.setValidators(quantityValueValidators);
  }

  setTab(str: string) {
    this.tabSelect = str;
    setTimeout(() => {
      this.getChartWidth();
      this.getChartHeight();
      this.changeDetectorRef.detectChanges();
    }, 50);
  }
  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setField(str: string) {
    this.currentField = str;
  }

  getChartWidth() {
    if (this.lineChartContainer) {
      this.chartContainerWidth = this.lineChartContainer.nativeElement.clientWidth * .9;
    }
    else {
      this.chartContainerWidth = 600;
    }
  }

  getChartHeight() {
    if (this.lineChartContainer) {
      this.chartContainerHeight = this.lineChartContainer.nativeElement.clientHeight * .8;
    }
    else {
      this.chartContainerHeight = 800;
    }
  }

  calculate(form: FormGroup) {
    let input: SteamPropertiesInput = {
      quantityValue: form.controls.quantityValue.value,
      thermodynamicQuantity: form.controls.thermodynamicQuantity.value,
      pressure: form.controls.pressure.value
    };
    this.steamService.steamPropertiesInput = input;
    this.updateForm();
    if (form.status === 'VALID') {
      this.steamPropertiesOutput = this.steamService.steamProperties(input, this.settings);
      this.plotReady = true;
    }
  }

  getEmptyResults(): SteamPropertiesOutput {
    return {
      pressure: 0,
      temperature: 0,
      specificEnthalpy: 0,
      specificEntropy: 0,
      quality: 0,
      specificVolume: 0
    };
  }

  addRow() {
    this.data = {
      pressure: this.steamPropertiesOutput.pressure,
      thermodynamicQuantity: this.steamPropertiesForm.controls.thermodynamicQuantity.value,
      temperature: this.steamPropertiesOutput.temperature,
      enthalpy: this.steamPropertiesOutput.specificEnthalpy,
      entropy: this.steamPropertiesOutput.specificEntropy,
      volume: this.steamPropertiesOutput.specificVolume
    };
  }

  toggleGraph() {
    this.graphToggle = this.graphToggleForm.controls.graphToggle.value.toString();
  }

  getRanges(quantityValue: number, pressure: number): { minPressure: number, maxPressure: number, minQuantityValue: number, maxQuantityValue: number } {
    let quantityRanges: { min: number, max: number } = this.steamService.getQuantityRange(this.settings, quantityValue);
    if (quantityValue == 0) {
      let maxMPaa: number = this.convertUnitsService.value(50).from('MPaa').to(this.settings.steamPressureMeasurement);
      if (pressure <= maxMPaa) {
        quantityRanges.max = this.convertUnitsService.value(2273.15).from('K').to(this.settings.steamTemperatureMeasurement);
      } else {
        quantityRanges.max = this.convertUnitsService.value(1073.15).from('K').to(this.settings.steamTemperatureMeasurement);
      }
    }
    let minPressure: number = Number(this.convertUnitsService.value(1).from('kPaa').to(this.settings.steamPressureMeasurement).toFixed(3));
    let maxPressure: number = Number(this.convertUnitsService.value(100).from('MPaa').to(this.settings.steamPressureMeasurement).toFixed(3));
    return { minQuantityValue: quantityRanges.min, maxQuantityValue: quantityRanges.max, minPressure: minPressure, maxPressure: maxPressure };
  }
}
