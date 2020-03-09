import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsatSankeyComponent } from './psat-sankey.component';
import { SankeyModule } from '../../shared/sankey/sankey.module';



@NgModule({
  declarations: [PsatSankeyComponent],
  imports: [
    CommonModule,
    SankeyModule
  ],
  exports: [
    PsatSankeyComponent
  ]
})
export class PsatSankeyModule { }
