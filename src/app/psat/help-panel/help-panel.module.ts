import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpPanelComponent } from './help-panel.component';
import { SystemBasicsHelpComponent } from './system-basics-help/system-basics-help.component';
import { PumpFluidHelpComponent } from './pump-fluid-help/pump-fluid-help.component';
import { MotorHelpComponent } from './motor-help/motor-help.component';
import { FieldDataHelpComponent } from './field-data-help/field-data-help.component';
import { ModifyConditionsNotesComponent } from '../modify-conditions/modify-conditions-notes/modify-conditions-notes.component';
import { HelpPanelService } from './help-panel.service';
import { FormsModule } from '@angular/forms';
import { ExploreOpportunitiesModule } from '../explore-opportunities/explore-opportunities.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ExploreOpportunitiesModule
  ],
  declarations: [
    HelpPanelComponent,
    SystemBasicsHelpComponent,
    PumpFluidHelpComponent,
    MotorHelpComponent,
    FieldDataHelpComponent,
    ModifyConditionsNotesComponent
  ],
  providers: [
    HelpPanelService
  ],
  exports: [
    HelpPanelComponent
  ]
})
export class HelpPanelModule { }
