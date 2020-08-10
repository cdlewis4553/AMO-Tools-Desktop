import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { pumpTypesConstant, motorEfficiencyConstants, driveConstants } from '../psat/psatConstants';
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
}
