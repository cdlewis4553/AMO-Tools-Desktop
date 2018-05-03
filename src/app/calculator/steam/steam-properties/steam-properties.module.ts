import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamPropertiesGraphComponent } from './steam-properties-graph/steam-properties-graph.component';
import { SteamPropertiesComponent } from './steam-properties.component';
import { SteamPropertiesFormComponent } from './steam-properties-form/steam-properties-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    SteamPropertiesGraphComponent,
    SteamPropertiesComponent,
    SteamPropertiesFormComponent
  ],
  exports: [
    SteamPropertiesComponent
  ]
})
export class SteamPropertiesModule { }
