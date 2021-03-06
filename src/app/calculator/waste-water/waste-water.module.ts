import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteWaterListComponent } from './waste-water-list/waste-water-list.component';
import { RouterModule } from '@angular/router';
import { O2UtilizationRateModule } from './o2-utilization-rate/o2-utilization-rate.module';

@NgModule({
  declarations: [WasteWaterListComponent],
  exports: [WasteWaterListComponent],
  imports: [
    CommonModule,
    RouterModule,
    O2UtilizationRateModule
  ]
})
export class WasteWaterModule { }
