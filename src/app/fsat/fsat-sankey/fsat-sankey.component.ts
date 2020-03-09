import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
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
  location: string;
  @Input()
  printView: boolean;
  @Input()
  modIndex: number;
  @Input()
  assessmentName: string;
  @Input()
  isBaseline: boolean;

  firstChange: boolean = true;
  
  // fsatCopy: FSAT;
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
    this.getResults();
    this.setSankeyData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fsat) {
      if (!changes.fsat.firstChange) {
        this.getResults();
        this.setSankeyData();
      }
    }
  }

  setSankeyData(){
    let losses: Array<{label: string, value: number}> = new Array();
    let outputEnergy: number = this.energyInput - this.motorLoss - this.fanLoss - this.driveLoss;
    losses.push({
      value: this.motorLoss,
      label: 'Motor Losses'
    });
    if(this.driveLoss > 0){
      losses.push({
        value: this.driveLoss,
        label: 'Drive Losses'
      });
    }
    losses.push({
      value: this.fanLoss,
      label: 'Fan Losses'
    });

    this.sankeyData = {
      energyInput: this.energyInput,
      losses: losses,
      additions: [],
      outputEnergy: outputEnergy
    }
  }

  getResults() {
    let energyInput: number, motorLoss: number, driveLoss: number, fanLoss: number, usefulOutput: number;
  //  let motorShaftPower: number, fanShaftPower: number;
    let isBaseline: boolean;

    if (this.fsat.name === undefined || this.fsat.name === null || this.fsat.name === 'Baseline') {
      isBaseline = true;
    }
    else {
      isBaseline = true;
    }

    let tmpOutput = this.fsatService.getResults(this.fsat, isBaseline, this.settings);

    if (this.settings.fanPowerMeasurement === 'hp') {
      // motorShaftPower = this.convertUnitsService.value(tmpOutput.motorShaftPower).from('hp').to('kW');
      // fanShaftPower = this.convertUnitsService.value(tmpOutput.fanShaftPower).from('hp').to('kW');
      energyInput = tmpOutput.motorPower;
      motorLoss = energyInput - this.convertUnitsService.value(tmpOutput.motorShaftPower).from('hp').to('kW');
      driveLoss = this.convertUnitsService.value(tmpOutput.motorShaftPower - tmpOutput.fanShaftPower).from('hp').to('kW');
      fanLoss = this.convertUnitsService.value(tmpOutput.fanShaftPower).from('hp').to('kW') * (1 - (tmpOutput.fanEfficiency / 100));
      usefulOutput = this.convertUnitsService.value(tmpOutput.fanShaftPower).from('hp').to('kW') * (tmpOutput.fanEfficiency / 100);
    }
    else {
      // motorShaftPower = tmpOutput.motorShaftPower;
      // fanShaftPower = tmpOutput.fanShaftPower;
      energyInput = tmpOutput.motorPower;
      motorLoss = tmpOutput.motorPower - tmpOutput.motorShaftPower;
      driveLoss = tmpOutput.motorShaftPower - tmpOutput.fanShaftPower;
      fanLoss = tmpOutput.fanShaftPower * (1 - (tmpOutput.fanEfficiency / 100));
      usefulOutput = tmpOutput.fanShaftPower * (tmpOutput.fanEfficiency / 100);
    }

    this.energyInput = energyInput;
    this.fanLoss = fanLoss;
    this.driveLoss = driveLoss;
    this.motorLoss = motorLoss;
  }

}
