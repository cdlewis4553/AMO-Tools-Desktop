import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { PhastService } from '../../phast.service';
import { AuxiliaryPowerLoss } from '../../../shared/models/losses/auxiliaryPowerLoss';
import { Losses } from '../../../shared/models/phast';
import { AuxiliaryPowerLossesService } from './auxiliary-power-losses.service';

@Component({
  selector: 'app-auxiliary-power-losses',
  templateUrl: './auxiliary-power-losses.component.html',
  styleUrls: ['./auxiliary-power-losses.component.css']
})
export class AuxiliaryPowerLossesComponent implements OnInit {
  @Input()
  losses: Losses;
  @Input()
  saveClicked: boolean;
  @Input()
  lossState: any;
  @Input()
  addLossToggle: boolean;
  @Output('savedLoss')
  savedLoss = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('fieldChange')
  fieldChange = new EventEmitter<string>();

  _auxiliaryPowerLosses: Array<any>;
  firstChange: boolean = true;
  constructor(private phastService: PhastService, private auxiliaryPowerLossesService: AuxiliaryPowerLossesService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.saveClicked) {
        this.saveLosses();
      }
      if (changes.addLossToggle) {
        this.addLoss();
      }
    }
    else {
      this.firstChange = false;
    }
  }

  ngOnInit() {
    if (!this._auxiliaryPowerLosses) {
      this._auxiliaryPowerLosses = new Array();
    }
    if (this.losses.auxiliaryPowerLosses) {
      this.losses.auxiliaryPowerLosses.forEach(loss => {
        let tmpLoss = {
          form: this.auxiliaryPowerLossesService.getFormFromLoss(loss),
          name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
          powerUsed: loss.powerUsed || 0.0
        };
        this.calculate(tmpLoss);
        this._auxiliaryPowerLosses.unshift(tmpLoss);
      })
    }
  }

  addLoss() {
    this._auxiliaryPowerLosses.unshift({
      form: this.auxiliaryPowerLossesService.initForm(),
      name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
      powerUsed: 0.0
    });
    this.lossState.saved = false;
  }

  removeLoss(str: string) {
    this._auxiliaryPowerLosses = _.remove(this._auxiliaryPowerLosses, loss => {
      return loss.name != str;
    });
    this.lossState.saved = false;
    this.renameLossess();
  }

  renameLossess() {
    let index = 1;
    this._auxiliaryPowerLosses.forEach(loss => {
      loss.name = 'Loss #' + index;
      index++;
    })
  }

  calculate(loss: any) {
    loss.powerUsed = this.phastService.auxiliaryPowerLoss(
      loss.form.value.motorPhase,
      loss.form.value.supplyVoltage,
      loss.form.value.avgCurrent,
      loss.form.value.powerFactor,
      loss.form.value.operatingTime
    );
  }


  saveLosses() {
    let tmpAuxLosses = new Array<AuxiliaryPowerLoss>();
    this._auxiliaryPowerLosses.forEach(loss => {
      let tmpAuxLoss = this.auxiliaryPowerLossesService.getLossFromForm(loss.form);
      tmpAuxLoss.powerUsed = loss.powerUsed;
      tmpAuxLosses.unshift(tmpAuxLoss);
    })
    this.losses.auxiliaryPowerLosses = tmpAuxLosses;
    this.lossState.numLosses = this.losses.auxiliaryPowerLosses.length;
    this.lossState.saved = true;
    this.savedLoss.emit(true);
  }

  changeField(str: string) {
    this.fieldChange.emit(str);
  }


}