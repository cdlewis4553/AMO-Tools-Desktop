import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { O2UtilizationRateComponent } from './o2-utilization-rate.component';
import { O2UtilizationRateService } from './o2-utilization-rate.service';
import { O2UtilizationRateFormComponent } from './o2-utilization-rate-form/o2-utilization-rate-form.component';
import { O2UtilizationRateHelpComponent } from './o2-utilization-rate-help/o2-utilization-rate-help.component';
import { O2UtilizationRateGraphComponent } from './o2-utilization-rate-graph/o2-utilization-rate-graph.component';



@NgModule({
  declarations: [
    O2UtilizationRateComponent,
    O2UtilizationRateFormComponent,
    O2UtilizationRateHelpComponent,
    O2UtilizationRateGraphComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    O2UtilizationRateService
  ]
})
export class O2UtilizationRateModule { }
