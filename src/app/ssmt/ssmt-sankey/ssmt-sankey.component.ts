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
  ssmt: SSMT; //baseline
  @Input()
  settings: Settings;
  @Input()
  isBaseline: boolean;
  @Input() 
  assessment: Assessment;

  baselineOutput: SSMTOutput;
  baselineInputData: SSMTInputs;
  
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

  sankeyData: SankeyData;
  
  constructor(private calculateLossesService: CalculateLossesService, private ssmtService: SsmtService,
    // private convertUnitsService: ConvertUnitsService,
    // private compareService: CompareService,
    private _dom: ElementRef,
    private renderer: Renderer2,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    console.log(this.ssmt.setupDone);
    if (this.ssmt.setupDone) {
  
      let resultData: { inputData: SSMTInputs, outputData: SSMTOutput } = this.ssmtService.calculateBaselineModel(this.assessment.ssmt, this.settings);
      this.assessment.ssmt.name = 'Baseline';
      resultData.outputData = this.calculateResultsWithMarginalCosts(this.assessment.ssmt, resultData.outputData);
      this.assessment.ssmt.outputData = resultData.outputData;
      this.baselineOutput = resultData.outputData;
      this.baselineInputData = resultData.inputData;
      this.losses = this.calculateLossesService.calculateLosses(this.baselineOutput, this.baselineInputData, this.settings, this.assessment.ssmt);
      
      console.log('losses', this.losses);
      console.log('baselineOutput', this.baselineOutput);
      this.setSankeyData();
    }
  }

  ngAfterViewInit() {
  }

  setSankeyData(){
    let losses: Array<{label: string, value: number}> = new Array();
    let outputEnergy: number = this.energyInput 
          - this.stackLosses 
          - this.otherLosses 
          - this.turbineLosses 
          - this.turbineGeneration
          - this.processUsage
          - this.unreturnedCondensate
          - this.returnedCondensate;

    this.energyInput = this.losses.fuelEnergy + this.losses.makeupWaterEnergy;
    this.stackLosses = this.losses.stack + this.losses.blowdown;
    this.otherLosses = this.losses.highPressureHeader + this.losses.mediumPressureHeader + this.losses.lowPressureHeader 
                        + this.losses.condensateLosses + this.losses.deaeratorVentLoss + this.losses.condensateFlashTankLoss + this.losses.lowPressureVentLoss;
    this.turbineLosses = this.losses.condensingTurbineEfficiencyLoss + this.losses.highToMediumTurbineEfficiencyLoss
                        + this.losses.highToLowTurbineEfficiencyLoss + this.losses.mediumToLowTurbineEfficiencyLoss + this.losses.condensingLosses
    this.turbineGeneration = this.losses.condensingTurbineUsefulEnergy + this.losses.highToLowTurbineUsefulEnergy 
                        + this.losses.highToMediumTurbineUsefulEnergy + this.losses.mediumToLowTurbineUsefulEnergy;
    this.processUsage = this.losses.highPressureProcessUsage + this.losses.mediumPressureProcessUsage + this.losses.lowPressureProcessUsage;
    this.unreturnedCondensate = this.losses.lowPressureProcessLoss + this.losses.highPressureProcessLoss + this.losses.mediumPressureProcessLoss;
    this.returnedCondensate = this.baselineOutput.returnCondensate.energyFlow;

    console.log(this.energyInput);
    console.log(this.stackLosses);
    console.log(this.otherLosses);
    console.log(this.turbineLosses);
    console.log(this.turbineGeneration);
    console.log(this.unreturnedCondensate);
    console.log(this.processUsage);
    console.log(this.returnedCondensate);

    losses.push(
      // {
      //   label: "i == 1",
      //   value: 0,
      // },
      // {
      //   label: "i == 2",
      //   value: 0,
      // },
      {
        label: "Stack Loss ",
        value: this.stackLosses,
      },
      // {
      //   name: "Other Losses",
      //   value: otherLossValue
      // },
      {
        label: "Turbine Losses ",
        value: this.turbineLosses,
      },
      // {
      //   label: "",
      //   value: initialLossPercent,
      //   x: .5,
      //   y: .65,
      //   source: 6,
      //   target: [7,8,9, 10],
      //   isConnector: true,
      //   isConnectingPath: true,
      //   nodeColor: this.nodeStartColor,
      //   id: 'turbineConnector'
      // },
      {
        label: "Turbine Generation ",
        value: this.turbineGeneration,
      },
      {
        label: "Unreturned Condensate",
        value: this.unreturnedCondensate,
      },
      {
        label: "Process Usage",
        value: this.processUsage,
      },
      {
        label: "Returned Condensate",
        value: this.returnedCondensate,
      },
    );

    // this.sankeyData = {
    //   energyInput: this.energyInput,
    //   losses: losses,
    //   additions: [],
    //   outputEnergy: outputEnergy
    // }

  }

   calculateResultsWithMarginalCosts(ssmt: SSMT, outputData: SSMTOutput, baselineResults?: SSMTOutput): SSMTOutput {
    let marginalCosts: { marginalHPCost: number, marginalMPCost: number, marginalLPCost: number };
    if (ssmt.name == 'Baseline') {
      marginalCosts = this.ssmtService.calculateBaselineMarginalCosts(ssmt, outputData, this.settings);
    } else {
      marginalCosts = this.ssmtService.calculateModificationMarginalCosts(ssmt, outputData, baselineResults, this.settings);
    }
    outputData.marginalHPCost = marginalCosts.marginalHPCost;
    outputData.marginalMPCost = marginalCosts.marginalMPCost;
    outputData.marginalLPCost = marginalCosts.marginalLPCost;
    return outputData;
  }

}
