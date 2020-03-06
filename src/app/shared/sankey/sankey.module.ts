import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyComponent } from './sankey.component';

@NgModule({
  declarations: [SankeyComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SankeyComponent
  ]
})
export class SankeyModule { }
