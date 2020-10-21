import { Component, Input, OnInit } from '@angular/core';
import { Assessment } from '../../../shared/models/assessment';
import { Settings } from '../../../shared/models/settings';
import { WasteWater } from '../../../shared/models/waste-water';
import { CompareService, WasteWaterDifferent } from '../../modify-conditions/compare.service';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.css']
})
export class InputDataComponent implements OnInit {
  @Input()
  wasteWater: WasteWater;
  @Input()
  settings: Settings;
  @Input()
  printView: boolean;

  compareModifications: Array<WasteWaterDifferent>;
  constructor(private compareService: CompareService) { }

  ngOnInit(): void {
    this.setCompareModifications();
  }

  setCompareModifications() {
    this.compareModifications = new Array();
    this.wasteWater.modifications.forEach(mod => {
      let modDifferent: WasteWaterDifferent = this.compareService.compareBaselineModification(this.wasteWater.baselineData, mod);
      this.compareModifications.push(modDifferent);
    });
  }

  checkActivateSludgeItemDifferent(itemStr: string): boolean {
    let differentExists: WasteWaterDifferent = this.compareModifications.find(modDifferent => { return modDifferent.activatedSludgeDifferent[itemStr] });
    return differentExists != undefined;
  }

  checkAeratorPerformanceItemDifferent(itemStr: string): boolean {
    let differentExists: WasteWaterDifferent = this.compareModifications.find(modDifferent => { return modDifferent.aeratorPerformanceDifferent[itemStr] });
    return differentExists != undefined;
  }

}
