import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteWaterListComponent } from './waste-water-list/waste-water-list.component';
import { StatePointAnalysisModule } from './state-point-analysis/state-point-analysis.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    WasteWaterListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StatePointAnalysisModule
  ],
  exports: [
    WasteWaterListComponent
  ]
})
export class WasteWaterModule { }
