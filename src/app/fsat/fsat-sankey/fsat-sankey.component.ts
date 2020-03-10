import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Settings } from '../../shared/models/settings';
import { FSAT } from '../../shared/models/fans';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { FsatService } from '../fsat.service';
import { SankeyData, SankeyColors } from '../../shared/sankey/sankey.model';

@Component({
  selector: 'app-fsat-sankey',
  templateUrl: './fsat-sankey.component.html',
  styleUrls: ['./fsat-sankey.component.css']
})
export class FsatSankeyComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  fsat: FSAT;
  @Input()
  printView: boolean;
  @Input()
  isBaseline: boolean;

  fsatCopy: FSAT;
  energyInput: number;
  motorLoss: number;
  driveLoss: number;
  fanLoss: number;

  sankeyColors: SankeyColors = {
    gradientStartColor: '#D4B904',
    gradientEndColor: '#E8D952',
    nodeStartColor: 'rgba(214, 185, 0, 1)',
    nodeArrowColor:'rgba(232, 217, 82, 1)'
  }
  
  sankeyData: SankeyData;
  
  constructor(private convertUnitsService: ConvertUnitsService, private fsatService: FsatService) { }

  ngOnInit() {
    this.calculateAndSetData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fsat && !changes.fsat.firstChange) {
      this.calculateAndSetData();
    }
  }

  calculateAndSetData() {
    //set copy
    this.setCopy();
    //calculate output data (coming from reports it will already be set so no need for this step)
    if (!this.fsatCopy.outputs) {
      this.setOutputs();
    }
    //calculate losses
    this.calcLosses();
    //set the sankey data
    this.setSankeyData();
  }

  setCopy(){
    this.fsatCopy = JSON.parse(JSON.stringify(this.fsat));
  }

  setOutputs(){
    this.fsatCopy.outputs = this.fsatService.getResults(this.fsatCopy, this.isBaseline, this.settings);
  }

  calcLosses() {
    if (this.settings.fanPowerMeasurement === 'hp') {
      this.fsatCopy.outputs.motorShaftPower = this.convertUnitsService.value(this.fsatCopy.outputs.motorShaftPower).from('hp').to('kW');
      this.fsatCopy.outputs.fanShaftPower = this.convertUnitsService.value(this.fsatCopy.outputs.fanShaftPower).from('hp').to('kW');
    }

    this.energyInput = this.fsatCopy.outputs.motorPower;
    this.fanLoss = this.fsatCopy.outputs.fanShaftPower * (1 - (this.fsatCopy.outputs.fanEfficiency / 100));
    this.driveLoss = this.fsatCopy.outputs.motorShaftPower - this.fsatCopy.outputs.fanShaftPower;
    this.motorLoss = this.fsatCopy.outputs.motorPower - this.fsatCopy.outputs.motorShaftPower;
  }

  setSankeyData(){
    let losses: Array<{label: string, value: number, groupIndex: number}> = new Array();
    let outputEnergy: number = this.fsatCopy.outputs.motorPower - this.motorLoss - this.fanLoss - this.driveLoss;
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
      value: this.fanLoss,
      label: 'Fan Losses'
    });
    this.sankeyData = {
      energyInput: this.fsatCopy.outputs.motorPower,
      losses: losses,
      additions: [],
      outputEnergy: outputEnergy
    }
  }

}
