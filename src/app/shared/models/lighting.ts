export interface LightingReplacementData {
  name?: string,
  operatingHours?: number,
  wattsPerLamp?: number,
  lampsPerFixture?: number,
  numberOfFixtures?: number,
  lumensPerLamp?: number,
  totalLighting?: number,
  electricityUse?: number
}


export interface LightingReplacementResults {
  baselineResults: LightingReplacementResult,
  modificationResults: LightingReplacementResult,
  totalEnergySavings: number,
  totalCostSavings: number
}

export interface LightingReplacementResult {
  totalElectricityUse: number;
  totalLighting: number;
  totalOperatingHours: number;
  totalOperatingCosts: number;
}