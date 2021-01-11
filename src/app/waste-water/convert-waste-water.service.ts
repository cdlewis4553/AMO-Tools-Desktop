import { Injectable } from '@angular/core';
import { ConvertUnitsService } from '../shared/convert-units/convert-units.service';
import { Settings } from '../shared/models/settings';
import { ActivatedSludgeData, AeratorPerformanceData, CalculationsTableRow, StatePointAnalysisInput, StatePointAnalysisResults, WasteWater, WasteWaterData, WasteWaterResults } from '../shared/models/waste-water';

@Injectable()
export class ConvertWasteWaterService {

  constructor(private convertUnitsService: ConvertUnitsService) { }

  convertWasteWater(wasteWater: WasteWater, oldSettings: Settings, newSettings: Settings): WasteWater {
    wasteWater.baselineData = this.convertWasteWaterData(wasteWater.baselineData, oldSettings, newSettings);
    wasteWater.modifications.forEach(modification => {
      modification = this.convertWasteWaterData(modification, oldSettings, newSettings);
    });
    return wasteWater;
  }

  convertWasteWaterData(wasteWaterData: WasteWaterData, oldSettings: Settings, newSettings: Settings): WasteWaterData {
    wasteWaterData.activatedSludgeData = this.convertActivatedSludgeData(wasteWaterData.activatedSludgeData, oldSettings, newSettings);
    wasteWaterData.aeratorPerformanceData = this.convertAeratorPerformanceData(wasteWaterData.aeratorPerformanceData, oldSettings, newSettings);
    return wasteWaterData;
  }

  convertActivatedSludgeData(activatedSludgeData: ActivatedSludgeData, oldSettings: Settings, newSettings: Settings): ActivatedSludgeData {
    //Volume: metric = m3, imperial = Mgal
    if (oldSettings.unitsOfMeasure == 'Metric' && newSettings.unitsOfMeasure == 'Imperial') {
      activatedSludgeData.Volume = this.convertUnitsService.value(activatedSludgeData.Volume).from('m3').to('Mgal');
    } else if (oldSettings.unitsOfMeasure == 'Imperial' && newSettings.unitsOfMeasure == 'Metric') {
      activatedSludgeData.Volume = this.convertUnitsService.value(activatedSludgeData.Volume).from('Mgal').to('m3');
    }
    activatedSludgeData.Volume = this.convertUnitsService.roundVal(activatedSludgeData.Volume, 2);
    return activatedSludgeData;
  }

  convertAeratorPerformanceData(aeratorPerformanceData: AeratorPerformanceData, oldSettings: Settings, newSettings: Settings): AeratorPerformanceData {
    //SOTR metric = kg/kWh, imperial lb/hr
    //Aeration metric = kW, imperial = hp
    //Elevation metric = m, imperial = ft
    if (oldSettings.unitsOfMeasure == 'Metric' && newSettings.unitsOfMeasure == 'Imperial') {
      aeratorPerformanceData.SOTR = this.convertUnitsService.value(aeratorPerformanceData.SOTR).from('kgkw').to('lbhp');
      aeratorPerformanceData.Aeration = this.convertUnitsService.value(aeratorPerformanceData.Aeration).from('kW').to('hp');
      aeratorPerformanceData.Elevation = this.convertUnitsService.value(aeratorPerformanceData.Elevation).from('m').to('ft');
    } else if (oldSettings.unitsOfMeasure == 'Imperial' && newSettings.unitsOfMeasure == 'Metric') {
      aeratorPerformanceData.SOTR = this.convertUnitsService.value(aeratorPerformanceData.SOTR).from('lbhp').to('kgkw');
      aeratorPerformanceData.Aeration = this.convertUnitsService.value(aeratorPerformanceData.Aeration).from('hp').to('kW');
      aeratorPerformanceData.Elevation = this.convertUnitsService.value(aeratorPerformanceData.Elevation).from('ft').to('m');
    }
    aeratorPerformanceData.SOTR = this.convertUnitsService.roundVal(aeratorPerformanceData.SOTR, 2);
    aeratorPerformanceData.Aeration = this.convertUnitsService.roundVal(aeratorPerformanceData.Aeration, 2);
    aeratorPerformanceData.Elevation = this.convertUnitsService.roundVal(aeratorPerformanceData.Elevation, 2);
    return aeratorPerformanceData;
  }


  convertResultsToMetric(wasteWaterResults: WasteWaterResults): WasteWaterResults {
    // TotalAverageDailyFlowRate: metric = m3/day, imperial = mgd 
    wasteWaterResults.TotalAverageDailyFlowRate = this.convertUnitsService.value(wasteWaterResults.TotalAverageDailyFlowRate).from('Mgal').to('m3');
    // VolumeInService: metric = m3, imperial = Mgal
    wasteWaterResults.VolumeInService = this.convertUnitsService.value(wasteWaterResults.VolumeInService).from('Mgal').to('m3');
    // InfluentBOD5MassLoading: metric = kg, imperial = lb
    wasteWaterResults.InfluentBOD5MassLoading = this.convertUnitsService.value(wasteWaterResults.InfluentBOD5MassLoading).from('lb').to('kg');
    // SecWWOxidNLoad: metric = kg, imperial = lb
    wasteWaterResults.SecWWOxidNLoad = this.convertUnitsService.value(wasteWaterResults.SecWWOxidNLoad).from('lb').to('kg');
    // SecWWTSSLoad: metric = kg, imperial = lb
    wasteWaterResults.SecWWTSSLoad = this.convertUnitsService.value(wasteWaterResults.SecWWTSSLoad).from('lb').to('kg');
    // TSSSludgeProduction: metric = kg, imperial = lb
    wasteWaterResults.TSSSludgeProduction = this.convertUnitsService.value(wasteWaterResults.TSSSludgeProduction).from('lb').to('kg');
    // TSSInActivatedSludgeEffluent: metric = kg, imperial = lb
    wasteWaterResults.TSSInActivatedSludgeEffluent = this.convertUnitsService.value(wasteWaterResults.TSSInActivatedSludgeEffluent).from('lb').to('kg');
    // TotalOxygenRequirements: metric = kg, imperial = lb
    wasteWaterResults.TotalOxygenRequirements = this.convertUnitsService.value(wasteWaterResults.TotalOxygenRequirements).from('lb').to('kg');
    // TotalOxygenReqWDenit: metric = kg, imperial = lb
    wasteWaterResults.TotalOxygenReqWDenit = this.convertUnitsService.value(wasteWaterResults.TotalOxygenReqWDenit).from('lb').to('kg');
    // TotalOxygenSupplied: metric = kg, imperial = lb
    wasteWaterResults.TotalOxygenSupplied = this.convertUnitsService.value(wasteWaterResults.TotalOxygenSupplied).from('lb').to('kg');

    // MixingIntensityInReactor: metric = kW/m3, imperial = hp/Mgal
    wasteWaterResults.MixingIntensityInReactor = this.convertUnitsService.value(wasteWaterResults.MixingIntensityInReactor).from('hpMgal').to('kWm3');

    // RASFlowRate: metric = m3/day, imperial = mgd 
    wasteWaterResults.RASFlowRate = this.convertUnitsService.value(wasteWaterResults.RASFlowRate).from('Mgal').to('m3');
    // WASFlowRate: metric = m3/day, imperial = mgd 
    wasteWaterResults.WASFlowRate = this.convertUnitsService.value(wasteWaterResults.WASFlowRate).from('Mgal').to('m3');
    // TotalSludgeProduction: metric = kg, imperial = lb
    wasteWaterResults.TotalSludgeProduction = this.convertUnitsService.value(wasteWaterResults.TotalSludgeProduction).from('lb').to('kg');

    // VOLR: metric = kg/m3, imperial = lb/kft3
    wasteWaterResults.VOLR = this.convertUnitsService.value(wasteWaterResults.VOLR).from('lbkft3').to('kgNm3');
    return wasteWaterResults;
  }

  convertCalcTableRowResultToMetric(row: CalculationsTableRow): CalculationsTableRow {
    //metric = kg, imperial = lb
    row.BiomassProd = this.convertUnitsService.value(row.BiomassProd).from('lb').to('kg');
    row.SludgeProd = this.convertUnitsService.value(row.SludgeProd).from('lb').to('kg');
    row.SolidProd = this.convertUnitsService.value(row.SolidProd).from('lb').to('kg');
    row.Effluent = this.convertUnitsService.value(row.Effluent).from('lb').to('kg');
    row.IntentWaste = this.convertUnitsService.value(row.IntentWaste).from('lb').to('kg');
    row.OxygenRqd = this.convertUnitsService.value(row.OxygenRqd).from('lb').to('kg');
    row.FlowMgd = this.convertUnitsService.value(row.FlowMgd).from('lb').to('kg');
    row.TotalO2Rqd = this.convertUnitsService.value(row.TotalO2Rqd).from('lb').to('kg');
    row.NRemoved = this.convertUnitsService.value(row.NRemoved).from('lb').to('kg');
    row.NitO2Dem = this.convertUnitsService.value(row.NitO2Dem).from('lb').to('kg');
    row.O2Reqd = this.convertUnitsService.value(row.O2Reqd).from('lb').to('kg');
    //metric = m3, imperial = Mgal
    row.NRemovedMgl = this.convertUnitsService.value(row.NRemovedMgl).from('Mgal').to('m3');
    row.WAS = this.convertUnitsService.value(row.WAS).from('Mgal').to('m3');
    row.EstimRas = this.convertUnitsService.value(row.EstimRas).from('Mgal').to('m3');
    return row;
  }

  convertStatePointAnalysisInput(input: StatePointAnalysisInput, settings: Settings) {
    input.sviValue = this.convertUnitsService.value(input.sviValue).from('mL/g').to('L/g');
    input.MLSS = this.convertUnitsService.value(input.MLSS).from('g/L').to('kgL');
    if (input.sviParameter == 4) {
      input.sludgeSettlingVelocity = this.convertUnitsService.value(input.sludgeSettlingVelocity).from('m/d').to('m/h');
    }
    
    if (settings.unitsOfMeasure == 'Imperial') {
      input.areaOfClarifier = this.convertUnitsService.value(input.areaOfClarifier).from('ft2').to('m2');
      input.influentFlow = this.convertUnitsService.value(input.influentFlow).from('MGD').to('L/h');
      input.rasFlow = this.convertUnitsService.value(input.rasFlow).from('MGD').to('L/h');
    } else if (settings.unitsOfMeasure == 'Metric'){
      input.influentFlow = this.convertUnitsService.value(input.influentFlow).from('m3/d').to('L/h');
      input.rasFlow = this.convertUnitsService.value(input.rasFlow).from('m3/d').to('L/h');
    }

    return input;
  }

  
  convertStatePointAnalysisExample(input: StatePointAnalysisInput) {
    input.areaOfClarifier = this.convertUnitsService.value(input.areaOfClarifier).from('ft2').to('m2');
    input.areaOfClarifier = this.convertUnitsService.roundVal(input.areaOfClarifier, 2);
    
    input.influentFlow = this.convertUnitsService.value(input.influentFlow).from('MGD').to('m3/d');
    input.influentFlow = this.convertUnitsService.roundVal(input.influentFlow, 2);

    input.rasFlow = this.convertUnitsService.value(input.rasFlow).from('MGD').to('m3/d');
    input.rasFlow = this.convertUnitsService.roundVal(input.rasFlow, 2);

    return input;
  }

  convertStatePointAnalysisResults(results: StatePointAnalysisResults, settings: Settings) {
    if (settings.unitsOfMeasure == 'Imperial') {
      results.TotalAreaClarifier = this.convertUnitsService.value(results.TotalAreaClarifier).from('m2').to('ft2');
      results.SurfaceOverflow = this.convertUnitsService.value(results.SurfaceOverflow).from('L/m2h').to('gal/ft2d');
      results.AppliedSolidsLoading = this.convertUnitsService.value(results.AppliedSolidsLoading).from('kg/m2h').to('lb/ft2d');

      results.OverFlowRateY2 = this.convertUnitsService.value(results.OverFlowRateY2).from('kg/m2h').to('lb/ft2d');
      results.UnderFlowRateY1 = this.convertUnitsService.value(results.UnderFlowRateY1).from('kg/m2h').to('lb/ft2d');
      results.StatePointY = this.convertUnitsService.value(results.StatePointY).from('kg/m2h').to('lb/ft2d');
      results.graphData = results.graphData.map(pair => {
        return [
          // pair[0] Solids Concentration: always g/L
          pair[0],
          // pair[1] Solids flux: kg/m2h to lb/ft2d
          this.convertUnitsService.value(pair[1]).from('kg/m2h').to('lb/ft2d')
        ];
      });
    } else if (settings.unitsOfMeasure == 'Metric'){
      results.SurfaceOverflow = this.convertUnitsService.value(results.SurfaceOverflow).from('L/m2h').to('L/m2d');
      results.AppliedSolidsLoading = this.convertUnitsService.value(results.AppliedSolidsLoading).from('kg/m2h').to('kg/m2d');

      results.OverFlowRateY2 = this.convertUnitsService.value(results.OverFlowRateY2).from('kg/m2h').to('kg/m2d');
      results.UnderFlowRateY1 = this.convertUnitsService.value(results.UnderFlowRateY1).from('kg/m2h').to('kg/m2d');
      results.StatePointY = this.convertUnitsService.value(results.StatePointY).from('kg/m2h').to('kg/m2d');

      results.graphData = results.graphData.map(pair => {
        return [
          // pair[0] Solids Concentration: always g/L
          pair[0],
          // pair[1] Solids flux: kg/m2h to kg/m2d
          this.convertUnitsService.value(pair[1]).from('kg/m2h').to('kg/m2d')
        ];
      });
    }
    
    results.RasConcentration = this.convertUnitsService.value(results.RasConcentration).from('kgL').to('mg/L');
    return results;
  }
}
