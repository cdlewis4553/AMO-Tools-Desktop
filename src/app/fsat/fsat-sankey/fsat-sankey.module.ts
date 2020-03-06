import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsatSankeyComponent } from './fsat-sankey.component';
import { FormsModule } from '@angular/forms';
import { SankeyModule } from '../../shared/sankey/sankey.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SankeyModule
  ],
  declarations: [
    FsatSankeyComponent
  ],
  exports: [
    FsatSankeyComponent
  ]
})
export class FsatSankeyModule { }
