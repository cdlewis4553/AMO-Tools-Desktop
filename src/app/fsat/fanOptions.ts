declare var Module: any;
export const FanTypes: Array<{ value: number, display: string, enumVal?: any }> = [
  {
    value: 0,
    display: 'Airfoil (SISW)',
    enumVal: Module ? !undefined: Module.FanType.AirfoilSISW 
  },
  {
    value: 1,
    display: 'Backward Curved (SISW)',
    enumVal: Module ? !undefined: Module.FanType.BackwardCurvedSISW 
  },
  {
    value: 2,
    display: 'Radial (SISW)',
    enumVal: Module ? !undefined: Module.FanType.RadialSISW 
  },
  {
    value: 3,
    display: 'Radial Tip (SISW)',
    enumVal: Module ? !undefined: Module.FanType.RadialTipSISW 
  },
  {
    value: 4,
    display: 'Backward Inclined (SISW)',
    enumVal: Module ? !undefined: Module.FanType.BackwardInclinedSISW 
  },
  {
    value: 5,
    display: 'Airfoil (DIDW)',
    enumVal: Module ? !undefined: Module.FanType.AirfoilDIDW 
  },
  {
    value: 6,
    display: 'Backward Curved (DIDW)',
    enumVal: Module ? !undefined: Module.FanType.BackwardCurvedDIDW 
  },
  {
    value: 7,
    display: 'Backward Inclined (DIDW)',
    enumVal: Module ? !undefined: Module.FanType.BackwardInclinedDIDW 
  },
  {
    value: 8,
    display: 'Vane Axel',
    enumVal: Module ? !undefined: Module.FanType.VaneAxial 
  },
  {
    value: 9,
    display: 'Air Handling',
    enumVal: Module ? !undefined: Module.FanType.AirHandling 
  },
  {
    value: 10,
    display: 'Material Handling',
    enumVal: Module ? !undefined: Module.FanType.MaterialHandling 
  },
  {
    value: 11,
    display: 'Long Shavings',
    enumVal: Module ? !undefined: Module.FanType.LongShavings 
  }
  // {
  //   value: 12,
  //   display: 'Specified Optimal Efficiency'
  // }
];

export const Drives: Array<{ value: number, display: string }> = [
  {
    value: 0,
    display: 'Direct Drive'
  },
  {
    value: 1,
    display: 'V-Belt Drive',
  }, {
    value: 2,
    display: 'Notched V-Belt Drive',
  }, {
    value: 3,
    display: 'Synchronous Belt Drive'
  }, {
    value: 4,
    display: 'Specified Efficiency'
  }
];

// export const EfficiencyClasses: Array<{ value: number, display: string }> = [
//   {
//     value: 0,
//     display: 'Standard Efficiency'
//   },
//   {
//     value: 1,
//     display: 'Energy Efficient'
//   },
//   {
//     value: 2,
//     display: 'Premium Efficient'
//   },
//   {
//     value: 3,
//     display: 'Specified'
//   }
// ];
