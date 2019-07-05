import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Settings } from "../../../../shared/models/settings";
import { SteamPropertiesOutput } from "../../../../shared/models/steam/steam-outputs";
import { SteamService } from "../../steam.service";
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';

@Component({
  selector: 'app-steam-properties-form',
  templateUrl: './steam-properties-form.component.html',
  styleUrls: ['./steam-properties-form.component.css']
})
export class SteamPropertiesFormComponent implements OnInit {
  @Input()
  steamPropertiesForm: FormGroup;
  @Input()
  settings: Settings;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<FormGroup>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  steamPropertiesOutput: SteamPropertiesOutput;
  @Output('emitQuantityChange')
  emitQuantityChange = new EventEmitter<number>();


  temperatureWarningP1: string;
  temperatureWarningP2: string;
  temperatureWarningP3: string;
  maxTemp: number;
  constructor(private convertUnitsService: ConvertUnitsService) {
  }

  ngOnInit() {
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  setQuantityValue() {
    this.steamPropertiesForm.controls.quantityValue.setValue('');
    this.emitQuantityChange.emit(this.steamPropertiesForm.controls.thermodynamicQuantity.value);
    this.steamPropertiesOutput = {
      pressure: 0,
      temperature: 0,
      specificEnthalpy: 0,
      specificEntropy: 0,
      quality: 0,
      specificVolume: 0
    };
  }
  calculate() {
    if (this.steamPropertiesForm.valid == false) {
      this.steamPropertiesOutput = {
        pressure: 0,
        temperature: 0,
        specificEnthalpy: 0,
        specificEntropy: 0,
        quality: 0,
        specificVolume: 0
      };
    }
    this.emitCalculate.emit(this.steamPropertiesForm);
    this.checkTemperatureWarning();
  }

  getOptionDisplayUnit(quantity: number) {
    let displayUnit: string;
    if (quantity === 0) {
      displayUnit = this.settings.steamTemperatureMeasurement;
      return displayUnit;
    } else if (quantity === 1) {
      displayUnit = this.settings.steamSpecificEnthalpyMeasurement;
      return displayUnit;
    } else if (quantity === 2) {
      displayUnit = this.settings.steamSpecificEntropyMeasurement;
      return displayUnit;
    } else if (quantity === 3) {
      return displayUnit;
    }
  }


  checkTemperatureWarning() {
    let maxMPaa: number = this.convertUnitsService.value(50).from('MPaa').to(this.settings.steamPressureMeasurement);
    if (this.steamPropertiesOutput.temperature != 0) {
      if (this.steamPropertiesForm.controls.pressure.value <= maxMPaa) {
        this.maxTemp = this.convertUnitsService.value(2273.15).from('K').to(this.settings.steamTemperatureMeasurement);
        if (this.maxTemp < this.steamPropertiesOutput.temperature) {
          this.temperatureWarningP1 = "Temperature of steam (";
          this.temperatureWarningP2 = ") exceeds boundaries of algorithm (";
          this.temperatureWarningP3 = ") for this pressure. Results may not be accurate.";
        } else {
          this.temperatureWarningP1 = null;
          this.temperatureWarningP2 = null;
          this.temperatureWarningP3 = null;
        }

      } else if (this.steamPropertiesForm.controls.pressure.value > maxMPaa) {
        this.maxTemp = this.convertUnitsService.value(1073.15).from('K').to(this.settings.steamTemperatureMeasurement);
        if (this.maxTemp < this.steamPropertiesOutput.temperature) {
          this.temperatureWarningP1 = "Temperature of steam (";
          this.temperatureWarningP2 = ") exceeds boundaries of algorithm (";
          this.temperatureWarningP3 = ") for this pressure. Results may not be accurate.";
        } else {
          this.temperatureWarningP1 = null;
          this.temperatureWarningP2 = null;
          this.temperatureWarningP3 = null;
        }
      } else {
        this.temperatureWarningP1 = null;
        this.temperatureWarningP2 = null;
        this.temperatureWarningP3 = null;
      }
    } else {
      this.temperatureWarningP1 = null;
      this.temperatureWarningP2 = null;
      this.temperatureWarningP3 = null;
    }
  }
}
