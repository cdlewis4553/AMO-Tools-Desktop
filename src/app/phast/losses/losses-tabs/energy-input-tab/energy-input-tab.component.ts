import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LossesService } from '../../losses.service';
import { Losses, PHAST } from '../../../../shared/models/phast/phast';
import { FormGroup } from '@angular/forms';
import { EnergyInputService } from '../../energy-input/energy-input.service';
import { EnergyInputCompareService } from '../../energy-input/energy-input-compare.service';
import { EnergyInputEAF } from '../../../../shared/models/phast/losses/energyInputEAF';
import { Subscription } from 'rxjs';
import { Settings } from '../../../../shared/models/settings';
import { PhastCompareService } from '../../../phast-compare.service';
import { PhastResultsService } from '../../../phast-results.service';

@Component({
  selector: 'app-energy-input-tab',
  templateUrl: './energy-input-tab.component.html',
  styleUrls: ['./energy-input-tab.component.css']
})
export class EnergyInputTabComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  inSetup: boolean;
  @Input()
  settings: Settings;

  badgeHover: boolean;
  displayTooltip: boolean;

  numLosses: number = 0;
  missingData: boolean;
  isDifferent: boolean;
  badgeClass: Array<string> = [];
  enInput1Done: boolean;
  compareSubscription: Subscription;
  lossSubscription: Subscription;
  constructor(private lossesService: LossesService, private energyInputService: EnergyInputService, private energyInputCompareService: EnergyInputCompareService, private cd: ChangeDetectorRef,
    private phastCompareService: PhastCompareService, private phastResultsService: PhastResultsService) { }

  ngOnInit() {
    this.setNumLosses();
    this.lossSubscription = this.lossesService.updateTabs.subscribe(val => {
      this.setNumLosses();
      this.enInput1Done = this.lossesService.enInput1Done;
      this.missingData = this.checkMissingData();
      this.isDifferent = this.checkDifferent();
      this.setBadgeClass();
    });
    this.badgeHover = false;
  }

  ngOnDestroy() {
    this.lossSubscription.unsubscribe();
  }

  setBadgeClass() {
    let badgeStr: Array<string> = ['success'];
    if (this.missingData || !this.enInput1Done) {
      badgeStr = ['missing-data'];
    } else if (this.isDifferent && !this.inSetup) {
      badgeStr = ['loss-different'];
    }
    this.badgeClass = badgeStr;
    this.cd.detectChanges();
  }

  setNumLosses() {
    if (this.phast.losses) {
      if (this.phast.losses.energyInputEAF) {
        this.numLosses = this.phast.losses.energyInputEAF.length;
      }
    }
  }
  checkMissingData(): boolean {
    let testVal = false;
    if (this.energyInputCompareService.baselineEnergyInput) {
      this.energyInputCompareService.baselineEnergyInput.forEach(loss => {
        if (this.checkLossValid(loss, this.phast) === false) {
          testVal = true;
        }
      });
    }
    if (this.energyInputCompareService.modifiedEnergyInput && !this.inSetup) {
      let selectedModification = this.phastCompareService.selectedModification.getValue();
      let losses: Losses;
      if (selectedModification) {
        losses = selectedModification.losses;
      }
      this.energyInputCompareService.modifiedEnergyInput.forEach(loss => {
        if (this.checkLossValid(loss, this.phast) === false) {
          testVal = true;
        }
      });
    }
    return testVal;
  }


  checkLossValid(loss: EnergyInputEAF, phast: PHAST) {
    let minElectricityInput: number;
    if (phast) {
      minElectricityInput = this.phastResultsService.getMinElectricityInputRequirement(phast, this.settings);
    }
    let tmpForm: FormGroup = this.energyInputService.getFormFromLoss(loss, minElectricityInput);
    if (tmpForm.status === 'VALID') {
      return true;
    } else {
      return false;
    }
  }

  checkDifferent() {
    if (this.energyInputCompareService.baselineEnergyInput && this.energyInputCompareService.modifiedEnergyInput) {
      return this.energyInputCompareService.compareAllLosses();
    }
  }

  showTooltip() {
    this.badgeHover = true;

    setTimeout(() => {
      this.checkHover();
    }, 1000);
  }

  hideTooltip() {
    this.badgeHover = false;
    this.displayTooltip = false;
  }

  checkHover() {
    if (this.badgeHover) {
      this.displayTooltip = true;
    }
    else {
      this.displayTooltip = false;
    }
  }
}
