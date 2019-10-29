import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { FormGroup } from '@angular/forms';
import { EquipmentCurveService } from '../equipment-curve.service';
import { SystemAndEquipmentCurveService, EquipmentInputs } from '../../system-and-equipment-curve.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-equipment-curve-form',
  templateUrl: './equipment-curve-form.component.html',
  styleUrls: ['./equipment-curve-form.component.css']
})
export class EquipmentCurveFormComponent implements OnInit {
  @Input()
  equipmentType: string;
  @Input()
  settings: Settings;


  smallUnit: string;
  equipmentCurveForm: FormGroup;
  options: Array<{ display: string, value: number }> = [
    { display: 'Diameter', value: 0 },
    { display: 'Speed', value: 1 }
  ];
  modWarning: string = null;
  resetFormsSub: Subscription;
  constructor(private equipmentCurveService: EquipmentCurveService, private systemAndEquipmentCurveService: SystemAndEquipmentCurveService) { }

  ngOnInit() {
    this.initForm();
    this.setSmallUnit();
    this.resetFormsSub = this.systemAndEquipmentCurveService.resetForms.subscribe(val => {
      if (val == true) {
        this.resetForm();
      }
    });
  }

  ngOnDestroy() {
    this.resetFormsSub.unsubscribe();
  }

  initForm() {
    let defaultData: EquipmentInputs = this.systemAndEquipmentCurveService.equipmentInputs.getValue();
    if (defaultData == undefined) {
      defaultData = this.equipmentCurveService.getEquipmentCurveDefault();
    }
    this.systemAndEquipmentCurveService.equipmentInputs.next(defaultData);
    this.equipmentCurveForm = this.equipmentCurveService.getEquipmentCurveFormFromObj(defaultData);
  }

  resetForm() {
    let defaultData: EquipmentInputs = this.systemAndEquipmentCurveService.equipmentInputs.getValue();
    this.equipmentCurveForm = this.equipmentCurveService.getEquipmentCurveFormFromObj(defaultData);
  }

  setSmallUnit() {
    if (this.equipmentType == 'pump') {
      if (this.settings.distanceMeasurement === 'ft') {
        this.smallUnit = 'in';
      } else {
        this.smallUnit = 'cm';
      }
    }
    else {
      if (this.settings.fanFlowRate === 'ft3/min') {
        this.smallUnit = 'in';
      }
      else {
        this.smallUnit = 'cm';
      }
    }
  }

  setModifiedMeasurementValidator() {
    this.equipmentCurveForm = this.equipmentCurveService.setModifiedMeasurementMinMax(this.equipmentCurveForm);
    this.save();
  }

  focusField(str: string) {
    this.systemAndEquipmentCurveService.focusedCalculator.next(this.equipmentType + '-curve');
    this.systemAndEquipmentCurveService.currentField.next(str);
  }

  changeMeasurementOption() {
    this.equipmentCurveForm.controls.modificationMeasurementOption.patchValue(this.equipmentCurveForm.controls.measurementOption.value);
    this.save();
  }

  save() {
    if (this.equipmentCurveForm.valid) {
      let equipmentInputs: EquipmentInputs = this.equipmentCurveService.getEquipmentCurveObjFromForm(this.equipmentCurveForm);
      this.systemAndEquipmentCurveService.equipmentInputs.next(equipmentInputs);
    } else {
      this.systemAndEquipmentCurveService.equipmentInputs.next(undefined);
    }
  }
}