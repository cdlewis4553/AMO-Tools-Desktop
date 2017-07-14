import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { EnergyInputCompareService } from '../energy-input-compare.service';
@Component({
  selector: 'app-energy-input-form',
  templateUrl: './energy-input-form.component.html',
  styleUrls: ['./energy-input-form.component.css']
})
export class EnergyInputFormComponent implements OnInit {
  @Input()
  energyInputForm: any;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('saveEmit')
  saveEmit = new EventEmitter<boolean>();
  @ViewChild('lossForm') lossForm: ElementRef;
  @Input()
  lossIndex: number;

  form: any;
  elements: any;

  firstChange: boolean = true;
  counter: any;
  constructor(private energyInputCompareService: EnergyInputCompareService, private windowRefService: WindowRefService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (!this.baselineSelected) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    } else {
      this.firstChange = false;
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.initDifferenceMonitor();
  }

  disableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = true;
    }
  }

  enableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = false;
    }
  }

  checkForm() {
    if (this.energyInputForm.status == "VALID") {
      this.calculate.emit(true);
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  emitSave() {
    this.saveEmit.emit(true);
  }

  startSavePolling() {
    this.checkForm();
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.emitSave();
    }, 3000)
  }


  initDifferenceMonitor() {
    if (this.energyInputCompareService.baselineEnergyInput && this.energyInputCompareService.modifiedEnergyInput && this.energyInputCompareService.differentArray.length != 0) {
      if (this.energyInputCompareService.differentArray[this.lossIndex]) {
        let doc = this.windowRefService.getDoc();

        //naturalGasHeatInput
        this.energyInputCompareService.differentArray[this.lossIndex].different.naturalGasHeatInput.subscribe((val) => {
          let naturalGasHeatInputElements = doc.getElementsByName('naturalGasHeatInput_' + this.lossIndex);
          naturalGasHeatInputElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //naturalGasFlow
        this.energyInputCompareService.differentArray[this.lossIndex].different.naturalGasFlow.subscribe((val) => {
          let naturalGasFlowElements = doc.getElementsByName('naturalGasFlow_' + this.lossIndex);
          naturalGasFlowElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //measuredOxygenFlow
        this.energyInputCompareService.differentArray[this.lossIndex].different.measuredOxygenFlow.subscribe((val) => {
          let measuredOxygenFlowElements = doc.getElementsByName('measuredOxygenFlow_' + this.lossIndex);
          measuredOxygenFlowElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //coalCarbonInjection
        this.energyInputCompareService.differentArray[this.lossIndex].different.coalCarbonInjection.subscribe((val) => {
          let coalCarbonInjectionInputElements = doc.getElementsByName('coalCarbonInjection_' + this.lossIndex);
          coalCarbonInjectionInputElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //coalHeatingValue
        this.energyInputCompareService.differentArray[this.lossIndex].different.coalHeatingValue.subscribe((val) => {
          let coalHeatingValueElements = doc.getElementsByName('coalHeatingValue_' + this.lossIndex);
          coalHeatingValueElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //electrodeUse
        this.energyInputCompareService.differentArray[this.lossIndex].different.electrodeUse.subscribe((val) => {
          let electrodeUseElements = doc.getElementsByName('electrodeUse_' + this.lossIndex);
          electrodeUseElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //electrodeHeatingValue
        this.energyInputCompareService.differentArray[this.lossIndex].different.electrodeHeatingValue.subscribe((val) => {
          let electrodeHeatingValueElements = doc.getElementsByName('electrodeHeatingValue_' + this.lossIndex);
          electrodeHeatingValueElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //otherFuels
        this.energyInputCompareService.differentArray[this.lossIndex].different.otherFuels.subscribe((val) => {
          let otherFuelsElements = doc.getElementsByName('otherFuels_' + this.lossIndex);
          otherFuelsElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
        //electricityInput
        this.energyInputCompareService.differentArray[this.lossIndex].different.electricityInput.subscribe((val) => {
          let electricityInputElements = doc.getElementsByName('electricityInput_' + this.lossIndex);
          electricityInputElements.forEach(element => {
            element.classList.toggle('indicate-different', val);
          });
        })
      }
    }
  }
}