import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { PsatService } from '../psat.service';
import { PSAT } from '../../shared/models/psat';
import { Settings } from '../../shared/models/settings';
import { SankeyData, SankeyColors } from '../../shared/sankey/sankey.model';

@Component({
  selector: 'app-psat-sankey',
  templateUrl: './psat-sankey.component.html',
  styleUrls: ['./psat-sankey.component.css']
})
export class PsatSankeyComponent implements OnInit {
  @Input()
  psat: PSAT; //baseline
  @Input()
  settings: Settings;
  @Input()
  printView: boolean;
  @Input()
  modIndex: number;
  @Input()
  isBaseline: boolean;

  //use copy for conversions to not mess up input data
  psatCopy: PSAT;
  motorLoss: number;
  driveLoss: number;
  pumpLoss: number;

  //input for standalone sankey
  sankeyColors: SankeyColors = {
    gradientStartColor: '#1F1EDC',
    gradientEndColor: '#3390DE',
    nodeStartColor: 'rgba(31, 30, 220, .9)',
    nodeArrowColor: 'rgba(51, 144, 222, .9)'
  }
  
  //input for standalone sankey
  sankeyData: SankeyData;
  constructor(
    private psatService: PsatService,
    private convertUnitsService: ConvertUnitsService
  ) { }

  ngOnInit() {
    this.calculateAndSetData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.psat && !changes.psat.firstChange) {
      this.calculateAndSetData();
    }
  }

  calculateAndSetData() {
    //set copy
    this.setCopy();
    //calculate output data (coming from reports it will already be set so no need for this step)
    if (!this.psatCopy.outputs) {
      this.setOutputs();
    }
    //calculate losses
    this.calcLosses();
    //set the sankey data
    this.setSankeyData();
  }

  setCopy() {
    this.psatCopy = JSON.parse(JSON.stringify(this.psat));
  }

  setOutputs() {
    let isPsatValid: boolean = this.psatService.isPsatValid(
      this.psatCopy.inputs,
      this.isBaseline
    );
    if (isPsatValid) {
      if (this.isBaseline) {
        this.psatCopy.outputs = this.psatService.resultsExisting(
          this.psatCopy.inputs,
          this.settings
        );
      } else {
        this.psatCopy.outputs = this.psatService.resultsModified(
          this.psatCopy.inputs,
          this.settings
        );
      }
    } else {
      this.psatCopy.outputs = this.psatService.emptyResults();
    }
  }

  calcLosses() {
    var motorShaftPower: number;
    var pumpShaftPower: number;
    if (this.settings.powerMeasurement === "hp") {
      motorShaftPower = this.convertUnitsService
        .value(this.psatCopy.outputs.motor_shaft_power)
        .from("hp")
        .to("kW");
      pumpShaftPower = this.convertUnitsService
        .value(this.psatCopy.outputs.pump_shaft_power)
        .from("hp")
        .to("kW");
    } else {
      motorShaftPower = this.psatCopy.outputs.motor_shaft_power;
      pumpShaftPower = this.psatCopy.outputs.pump_shaft_power;
    }
    this.motorLoss = this.psatCopy.outputs.motor_power * (1 - this.psatCopy.outputs.motor_efficiency / 100);
    this.driveLoss = motorShaftPower - pumpShaftPower;
    this.pumpLoss =
      (this.psatCopy.outputs.motor_power - this.motorLoss - this.driveLoss) *
      (1 - this.psatCopy.outputs.pump_efficiency / 100);
  }

  setSankeyData(){
    let losses: Array<{label: string, value: number, groupIndex: number}> = new Array();
    let outputEnergy: number = this.psatCopy.outputs.motor_power - this.motorLoss - this.pumpLoss - this.driveLoss;
    losses.push({
      groupIndex: 0,
      value: this.motorLoss,
      label: 'Motor Losses'
    });
    if(this.driveLoss > 0){
      losses.push({
        groupIndex: 1,
        value: this.driveLoss,
        label: 'Drive Losses'
      });
    }
    losses.push({
      groupIndex: 2,
      value: this.pumpLoss,
      label: 'Pump Losses'
    });
    this.sankeyData = {
      energyInput: this.psatCopy.outputs.motor_power,
      losses: losses,
      additions: [],
      outputEnergy: outputEnergy
    }
  }
}