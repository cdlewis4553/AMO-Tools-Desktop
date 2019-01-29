//consolidating lighting replacement objects
//and creating container object to be stored
//within calculator object

export interface LightingReplacement {
    name: string,
    baselineData: Array<LightingReplacementData>,
    modificationData: Array<LightingReplacementData>,
    baselineResults: LightingReplacementResults,
    modificationResults: LightingReplacementResults
};


export interface LightingReplacementData {
    hoursPerDay?: number,
    daysPerMonth?: number,
    monthsPerYear?: number,
    hoursPerYear?: number,
    wattsPerLamp?: number,
    lampsPerFixture?: number,
    numberOfFixtures?: number,
    lumensPerLamp?: number,
    totalLighting?: number,
    electricityUse?: number
}


export interface LightingReplacementResults {
    totalElectricityUse: number;
    totalLighting: number;
    totalOperatingHours: number;
}