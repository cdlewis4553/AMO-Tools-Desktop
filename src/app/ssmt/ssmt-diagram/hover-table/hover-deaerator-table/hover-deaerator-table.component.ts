import { Component, OnInit, Input } from '@angular/core';
import { DeaeratorOutput } from '../../../../shared/models/steam/steam-outputs';
import { CalculateModelService } from '../../../ssmt-calculations/calculate-model.service';
import { SSMTInputs, BoilerInput } from '../../../../shared/models/steam/ssmt';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-hover-deaerator-table',
  templateUrl: './hover-deaerator-table.component.html',
  styleUrls: ['./hover-deaerator-table.component.css']
})
export class HoverDeaeratorTableComponent implements OnInit {
  @Input()
  settings: Settings;

  deaerator: DeaeratorOutput;
  boilerInput: BoilerInput;
  constructor(private calculateModelService: CalculateModelService) { }

  ngOnInit() {
    this.deaerator = this.calculateModelService.deaeratorOutput;
    this.boilerInput = this.calculateModelService.inputData.boilerInput;
  }

}