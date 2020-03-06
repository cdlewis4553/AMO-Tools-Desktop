import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyComponent } from './sankey.component';
import { SankeyService } from './sankey.service';

@NgModule({
  declarations: [SankeyComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SankeyComponent
  ],
  providers: [
    SankeyService
  ]
})
export class SankeyModule { }
