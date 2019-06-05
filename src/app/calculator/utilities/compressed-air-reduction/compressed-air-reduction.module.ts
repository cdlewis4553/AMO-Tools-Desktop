import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CompressedAirReductionComponent } from './compressed-air-reduction.component';
import { CompressedAirReductionService } from './compressed-air-reduction.service';
import { CompressedAirReductionFormComponent } from './compressed-air-reduction-form/compressed-air-reduction-form.component';
import { CompressedAirReductionResultsComponent } from './compressed-air-reduction-results/compressed-air-reduction-results.component';
import { CompressedAirReductionHelpComponent } from './compressed-air-reduction-help/compressed-air-reduction-help.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CompressedAirReductionComponent,
    CompressedAirReductionFormComponent,
    CompressedAirReductionResultsComponent,
    CompressedAirReductionHelpComponent,
  ],
   providers: [
     CompressedAirReductionService
   ],
   exports: [
     CompressedAirReductionComponent
   ]
})
export class CompressedAirReductionModule { }