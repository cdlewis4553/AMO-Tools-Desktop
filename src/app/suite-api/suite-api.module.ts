import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FansApiService } from './fans-api.service';
import { PumpsApiService } from './pumps-api.service';
import { SuiteApiEnumHelperService } from './suite-api-enum-helper.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    FansApiService,
    PumpsApiService,
    SuiteApiEnumHelperService
  ]
})
export class SuiteApiModule { }
