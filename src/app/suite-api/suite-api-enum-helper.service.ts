import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { pumpTypesConstant, motorEfficiencyConstants, driveConstants } from '../psat/psatConstants';
import { FanTypes } from '../fsat/fanOptions';
//wasm module
declare var Module: any;

@Injectable()
export class SuiteApiEnumHelperService {

  constructor() { }

  getPumpStyleEnum(pumpStyle: number){
    let pumpStyleConstant = _.find(pumpTypesConstant, (pumpType) => {return pumpType.value == pumpStyle});
    return pumpStyleConstant.enumVal;
  }

  getLineFrequencyEnum(lineFreq: number) {
    let lineFrequency = Module.LineFrequency.FREQ50;
    if (lineFreq == 60) {
      lineFrequency = Module.LineFrequency.FREQ60;
    }
    return lineFrequency;
  }

  getMotorEfficiencyEnum(motorEffVal: number) {
    let selectedMotorEfficiencyType = _.find(motorEfficiencyConstants, (motorConstant) => { return motorConstant.value == motorEffVal });
    return selectedMotorEfficiencyType.enumVal;
  }

  getDriveEnum(drive: number) {
    let driveType = _.find(driveConstants, (driveConstant) => { return driveConstant.value == drive });
    return driveType.enumVal;
  }

  getFixedSpeedEnum(fixedSpeed: number) {
    if (fixedSpeed == 0) {
      return Module.SpecificSpeed.FIXED_SPEED;
    } else {
      return Module.SpecificSpeed.NOT_FIXED_SPEED;
    }
  }

  getLoadEstimationMethod(method: number) {
    if (method == 0) {
      return Module.LoadEstimationMethod.POWER;
    } else {
      return Module.LoadEstimationMethod.CURRENT;
    }
  }

  getBasGensityInputTypeEnum(type: string) {
    if (type == 'relativeHumidity') {
      return Module.BaseGasDensityInputType.RelativeHumidity;
    } else if (type == 'wetBulb') {
      return Module.BaseGasDensityInputType.WetBulbTemp;
    } else if (type == 'dewPoint') {
      return Module.BaseGasDensityInputType.DewPoint;
    } else if (type == 'custom') {
      return;
    }
  }
  getGasTypeEnum(type: string) {
    if (type == 'AIR') {
      return Module.GasType.AIR;
    } else if (type == 'OTHER') {
      return Module.GasType.OTHER;
    }
  }

  getFanTypeEnum(fanType: number){
    let fanTypeConstant = _.find(FanTypes, (type) => {return type.value == fanType});
    return fanTypeConstant.enumVal;
  }
}
