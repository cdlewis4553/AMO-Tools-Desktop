import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../../../shared/models/settings';
import { StatePointAnalysisInput, StatePointAnalysisOutput, StatePointAnalysisResults } from '../../../shared/models/waste-water';
import { ConvertWasteWaterService } from '../../../waste-water/convert-waste-water.service';
import { StatePointAnalysisFormService } from './state-point-analysis-form.service';
declare var sviAddon: any;

@Injectable()
export class StatePointAnalysisService {
  baselineData: BehaviorSubject<StatePointAnalysisInput>;
  modificationData: BehaviorSubject<StatePointAnalysisInput>;
  output: BehaviorSubject<StatePointAnalysisOutput>;
  
  currentField: BehaviorSubject<string>;
  resetData: BehaviorSubject<boolean>;
  generateExample: BehaviorSubject<boolean>;

  sviParameters: Array<{ value: number, display: string }>

  constructor(private convertWasteWaterService: ConvertWasteWaterService, 
              private statePointAnalysisFormService: StatePointAnalysisFormService,
              ) {
    this.baselineData = new BehaviorSubject<StatePointAnalysisInput>(undefined);
    this.modificationData = new BehaviorSubject<StatePointAnalysisInput>(undefined);
    this.output = new BehaviorSubject<StatePointAnalysisOutput>(undefined);

    this.currentField = new BehaviorSubject<string>('default');
    this.resetData = new BehaviorSubject<boolean>(undefined);
    this.generateExample = new BehaviorSubject<boolean>(undefined);

    this.sviParameters = [
      {
        value: 0,
        display: 'SVISN'
      },
      {
        value: 1,
        display: 'SVIGN'
      },
      {
        value: 2,
        display: 'SVIGS'
      },
      {
        value: 3,
        display: 'SVISS'
      },
      {
        value: 4,
        display: 'VoK'
      }
    ];
  }

  calculate(settings: Settings) {
    let baselineInputs: StatePointAnalysisInput = this.baselineData.getValue();
    let modificationInputs: StatePointAnalysisInput = this.modificationData.getValue();
    
    this.initDefaultEmptyOutput();
    let output: StatePointAnalysisOutput = this.output.getValue();
    
    let validBaseline = this.statePointAnalysisFormService.getFormFromInput(baselineInputs);
    if (validBaseline) {
      let baselineInputCopy = JSON.parse(JSON.stringify(baselineInputs));
      baselineInputCopy = this.convertWasteWaterService.convertStatePointAnalysisInput(baselineInputCopy, settings);
      
      let baselineResults: StatePointAnalysisResults = sviAddon.svi(baselineInputCopy);
      baselineResults = this.convertWasteWaterService.convertStatePointAnalysisResults(baselineResults, settings);
      output.baseline = baselineResults;
      output.sviParameterName = this.sviParameters[baselineInputs.sviParameter].display;
      if (modificationInputs) {
        let validModification = this.statePointAnalysisFormService.getFormFromInput(modificationInputs);
        if (validModification) {
          let modificationInputCopy = JSON.parse(JSON.stringify(modificationInputs));
          modificationInputCopy = this.convertWasteWaterService.convertStatePointAnalysisInput(modificationInputCopy, settings);
          
          let modificationResults: StatePointAnalysisResults = sviAddon.svi(modificationInputCopy);
          modificationResults = this.convertWasteWaterService.convertStatePointAnalysisResults(modificationResults, settings);
          output.modification = modificationResults;
        }
      }
    }
    this.output.next(output);
  }

  initDefaultEmptyInputs() {
    let emptyBaselineData: StatePointAnalysisInput = {
      sviParameter: 0,
      sviValue: 0,
      numberOfClarifiers: 0,
      areaOfClarifier: 0,
      MLSS: 0,
      influentFlow: 0,
      rasFlow: 0,
      sludgeSettlingVelocity: 1
    };

    this.baselineData.next(emptyBaselineData);
    this.modificationData.next(undefined);
  }

  initDefaultEmptyOutput() {
     let output: StatePointAnalysisOutput = {
      baseline: {
        SurfaceOverflow: 0,
        AppliedSolidsLoading: 0,
        RasConcentration: 0,
        UnderFlowRateX2: 0,
        UnderFlowRateY1: 0,
        OverFlowRateX2: 0,
        OverFlowRateY2: 0,
        StatePointX: 0,
        StatePointY: 0,
        TotalAreaClarifier: 0
      },
      modification: {
        SurfaceOverflow: 0,
        AppliedSolidsLoading: 0,
        RasConcentration: 0,
        UnderFlowRateX2: 0,
        UnderFlowRateY1: 0,
        OverFlowRateX2: 0,
        OverFlowRateY2: 0,
        StatePointX: 0,
        StatePointY: 0,
        TotalAreaClarifier: 0
      },
      
    };
    this.output.next(output);
  }

  initModification() {
    let currentBaselineData: StatePointAnalysisInput = this.baselineData.getValue();
    let currentBaselineCopy = JSON.parse(JSON.stringify(currentBaselineData));
    this.modificationData.next(currentBaselineCopy);
  }

  generateExampleData(settings: Settings) {
    // SVIGN method examples
    let exampleBaseline: StatePointAnalysisInput = {
      sviValue: 150,
      sviParameter: 1,
      numberOfClarifiers: 1,
      areaOfClarifier: 10010.427,
      MLSS: 2.5,
      influentFlow: 12,
      rasFlow: 5,
      sludgeSettlingVelocity: 1,
    }

    let exampleMod: StatePointAnalysisInput = {
      sviValue: 150,
      sviParameter: 1,
      numberOfClarifiers: 1,
      areaOfClarifier: 10010.427,
      MLSS: 2.5,
      influentFlow: 6.34,
      rasFlow: 5,
      sludgeSettlingVelocity: 1,
    }

    if (settings.unitsOfMeasure == 'Metric') {
      exampleBaseline = this.convertWasteWaterService.convertStatePointAnalysisExample(exampleBaseline);
      exampleMod = this.convertWasteWaterService.convertStatePointAnalysisExample(exampleMod);
    }

    this.baselineData.next(exampleBaseline);
    this.modificationData.next(exampleMod);
    this.generateExample.next(true);
  }

}
