import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { SSMT, SSMTInputs } from '../../shared/models/steam/ssmt';
import { Settings } from '../../shared/models/settings';
import { Assessment } from '../../shared/models/assessment';
import { SSMTOutput, SSMTLosses } from '../../shared/models/steam/steam-outputs';
import { CalculateLossesService } from '../calculate-losses.service';
import { SsmtService } from '../ssmt.service';
import { DecimalPipe } from '@angular/common';
import { SankeyColors, SankeyData } from '../../shared/sankey/sankey.model';

@Component({
  selector: 'app-ssmt-sankey',
  templateUrl: './ssmt-sankey.component.html',
  styleUrls: ['./ssmt-sankey.component.css']
})
export class SsmtSankeyComponent implements OnInit {
  @Input()
  baselineSSMT: SSMT;
  @Input()
  sankeySSMT: SSMT; //baseline
  @Input()
  settings: Settings;
  @Input()
  isBaseline: boolean;


  energyInput: number;
  stackLosses: number;
  otherLosses: number;
  turbineLosses: number;
  turbineGeneration: number;
  processUsage: number;
  unreturnedCondensate: number;
  returnedCondensate: number;

  losses: SSMTLosses;

  sankeyColors: SankeyColors = {
    gradientStartColor: '#c77f0a',
    gradientEndColor: '#f6b141',
    nodeStartColor: 'rgba(199,127,10, .9)',
    nodeArrowColor: 'rgba(246,177,65, .9)'
  }

  ssmtCopy: SSMT;
  sankeyData: SankeyData;
  constructor(private calculateLossesService: CalculateLossesService, private ssmtService: SsmtService) { }

  ngOnInit() {
    this.calculateAndSetData();
  }

  calculateAndSetData() {
    //set copy
    this.setCopy();
    //calculate output data (coming from reports it will already be set so no need for this step)
    this.setOutputs();
    //calculate losses
    this.calcLosses();
    //set the sankey data
    this.setSankeyData();
  }

  setCopy() {
    this.ssmtCopy = JSON.parse(JSON.stringify(this.sankeySSMT));
  }

  setOutputs() {
    if (this.ssmtCopy.setupDone) {
      if (!this.ssmtCopy.outputData) {
        if (this.isBaseline) {
          let resultData: { inputData: SSMTInputs, outputData: SSMTOutput } = this.ssmtService.calculateBaselineModel(this.ssmtCopy, this.settings);
          this.ssmtCopy.outputData = resultData.outputData;
          this.losses = this.calculateLossesService.calculateLosses(resultData.outputData, resultData.inputData, this.settings, this.ssmtCopy);
        } else {
          let baselineResults: { inputData: SSMTInputs, outputData: SSMTOutput } = this.ssmtService.calculateBaselineModel(this.baselineSSMT, this.settings);
          let resultData: { inputData: SSMTInputs, outputData: SSMTOutput } = this.ssmtService.calculateModificationModel(this.ssmtCopy, this.settings, baselineResults.outputData);
          this.ssmtCopy.outputData = resultData.outputData;
          this.losses = this.calculateLossesService.calculateLosses(resultData.outputData, resultData.inputData, this.settings, this.ssmtCopy);
        }
      } else {
        //need input data for losses
        //baselinePowerDemand and isBaseline won't matter for losses calc
        let inputData: SSMTInputs = this.ssmtService.setupInputData(this.ssmtCopy, 0, false);
        this.losses = this.calculateLossesService.calculateLosses(this.ssmtCopy.outputData, inputData, this.settings, this.ssmtCopy);
      }
    }
  }

  calcLosses() {
    this.energyInput = this.losses.fuelEnergy + this.losses.makeupWaterEnergy;
    this.stackLosses = this.losses.stack + this.losses.blowdown;
    this.otherLosses = this.losses.highPressureHeader + this.losses.mediumPressureHeader + this.losses.lowPressureHeader
      + this.losses.condensateLosses + this.losses.deaeratorVentLoss + this.losses.condensateFlashTankLoss + this.losses.lowPressureVentLoss;
    this.turbineLosses = this.losses.condensingTurbineEfficiencyLoss + this.losses.highToMediumTurbineEfficiencyLoss
      + this.losses.highToLowTurbineEfficiencyLoss + this.losses.mediumToLowTurbineEfficiencyLoss + this.losses.condensingLosses
    this.turbineGeneration = this.losses.condensingTurbineUsefulEnergy + this.losses.highToLowTurbineUsefulEnergy
      + this.losses.highToMediumTurbineUsefulEnergy + this.losses.mediumToLowTurbineUsefulEnergy;
    this.processUsage = this.losses.allProcessUsageUsefulEnergy;
    this.unreturnedCondensate = this.losses.lowPressureProcessLoss + this.losses.highPressureProcessLoss + this.losses.mediumPressureProcessLoss;
    this.returnedCondensate = this.ssmtCopy.outputData.returnCondensate.energyFlow;
  }


  setSankeyData() {
    let losses: Array<{ label: string, value: number, groupIndex: number }> = new Array();
    //energyInput: number;
    if (this.stackLosses != 0) {
      losses.push(
        {
          groupIndex: 0,
          label: "Stack Loss",
          value: this.stackLosses,
        },
      );
    }
    if (this.otherLosses != 0) {
      losses.push(
        {
          groupIndex: 0,
          label: "Other Loss",
          value: this.otherLosses,
        },
      );
    }
    if (this.turbineLosses != 0) {
      losses.push(
        {
          groupIndex: 0,
          label: "Turbine Losses",
          value: this.turbineLosses,
        },
      );
    }
    if (this.unreturnedCondensate != 0) {
      losses.push(
        {
          groupIndex: 0,
          label: "Unreturned Condensate",
          value: this.unreturnedCondensate,
        },
      );
    }

    let outputEnergy: Array<{label: string, value: number}> = new Array();
    outputEnergy.push({
      label: 'Process Usage',
      value: this.processUsage
    });
    if(this.turbineGeneration != 0){
      outputEnergy.push({
        label: 'Turbine Generation',
        value: this.turbineGeneration
      });
    }

    this.sankeyData = {
      energyInput: this.energyInput,
      losses: losses,
      additions: [],
      outputEnergy: outputEnergy
    }
  }
}
