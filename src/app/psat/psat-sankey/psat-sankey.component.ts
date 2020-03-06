import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SankeyColors, SankeyData } from '../../shared/models/psat/sankey.model';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { PsatService } from '../psat.service';
import { PSAT } from '../../shared/models/psat';
import { Settings } from '../../shared/models/settings';

@Component({
  selector: 'app-psat-sankey',
  templateUrl: './psat-sankey.component.html',
  styleUrls: ['./psat-sankey.component.css']
})
export class PsatSankeyComponent implements OnInit {
  @Input()
  psat: PSAT; //baseline
  @Input()
  settings: Settings;
  @Input()
  printView: boolean;
  @Input()
  modIndex: number;
  @Input()
  isBaseline: boolean;

  motorLoss: number;
  driveLoss: number;
  pumpLoss: number;

  sankeyColors: SankeyColors = {
    gradientStartColor: '#1F1EDC',
    gradientEndColor: '#3390DE',
    nodeStartColor: 'rgba(31, 30, 220, .9)',
    nodeArrowColor: 'rgba(51, 144, 222, .9)'
  }
  psatCopy: PSAT;
  sankeyData: SankeyData;
  constructor(
    private psatService: PsatService,
    private convertUnitsService: ConvertUnitsService
  ) { }

  ngOnInit() {
    this.calculateAndSetData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.psat && !changes.psat.firstChange) {
      this.calculateAndSetData();
    }
  }

  calculateAndSetData() {
    this.setCopy();
    if (!this.psatCopy.outputs) {
      this.setOutputs();
    }
    this.calcLosses();
  }

  setCopy() {
    this.psatCopy = JSON.parse(JSON.stringify(this.psat.inputs));
  }

  setOutputs() {
    // let inputsCopy: PsatInputs = JSON.parse(JSON.stringify(this.psat.inputs));
    let isPsatValid: boolean = this.psatService.isPsatValid(
      this.psatCopy.inputs,
      this.isBaseline
    );
    if (isPsatValid) {
      if (this.isBaseline) {
        this.psatCopy.outputs = this.psatService.resultsExisting(
          this.psatCopy.inputs,
          this.settings
        );
      } else {
        this.psatCopy.outputs = this.psatService.resultsModified(
          this.psatCopy.inputs,
          this.settings
        );
      }
    } else {
      this.psatCopy.outputs = this.psatService.emptyResults();
    }
  }

  calcLosses() {
    var motorShaftPower;
    var pumpShaftPower;
    if (this.settings.powerMeasurement === "hp") {
      motorShaftPower = this.convertUnitsService
        .value(this.psatCopy.outputs.motor_shaft_power)
        .from("hp")
        .to("kW");
      pumpShaftPower = this.convertUnitsService
        .value(this.psatCopy.outputs.pump_shaft_power)
        .from("hp")
        .to("kW");
    } else {
      motorShaftPower = this.psatCopy.outputs.motor_shaft_power;
      pumpShaftPower = this.psatCopy.outputs.pump_shaft_power;
    }
    this.motorLoss = this.psatCopy.outputs.motor_power * (1 - this.psatCopy.outputs.motor_efficiency / 100);
    this.driveLoss = motorShaftPower - pumpShaftPower;
    this.pumpLoss =
      (this.psatCopy.outputs.motor_power - this.motorLoss - this.driveLoss) *
      (1 - this.psatCopy.outputs.pump_efficiency / 100);
  }

  setSankeyData(){
    let losses: Array<{label: string, value: number}> = new Array();
    let outputEnergy: number = this.psatCopy.outputs.motor_power - this.motorLoss - this.pumpLoss - this.driveLoss;
    losses.push({
      value: this.motorLoss,
      label: 'Motor Losses'
    });
    if(this.driveLoss > 0){
      losses.push({
        value: this.driveLoss,
        label: 'Drive Losses'
      });
    }
    losses.push({
      value: this.pumpLoss,
      label: 'Pump Losses'
    });
    this.sankeyData = {
      energyInput: this.psatCopy.outputs.motor_power,
      losses: losses,
      additions: [],
      outputEnergy: outputEnergy
    }
  }


  // buildNodes(results: PsatOutputs, nodes): Array<PsatSankeyNode> {
  //   const motorConnectorValue: number = results.motor_power - this.motor;
  //   let driveConnectorValue: number = 0;
  //   let usefulOutput: number = 0;

  //   if (this.drive > 0) {
  //     driveConnectorValue = motorConnectorValue - this.drive;
  //     usefulOutput = driveConnectorValue - this.pump;
  //   } else {
  //     usefulOutput = motorConnectorValue - this.pump;
  //   }

  //   nodes.push(
  //     {
  //       name: "Energy Input " + this.decimalPipe.transform(results.motor_power, '1.0-0') + " kW",
  //       value: 100,
  //       x: .1,
  //       y: .6,
  //       source: 0,
  //       target: [1,2],
  //       isConnector: true,
  //       nodeColor: this.nodeStartColor,
  //       id: 'originConnector'
  //     },
  //     {
  //       name: "",
  //       value: 0,
  //       x: .25,
  //       y: .6,
  //       source: 1,
  //       target: [2, 3],
  //       isConnector: true,
  //       nodeColor: this.nodeStartColor,
  //       id: 'inputConnector'
  //     },
  //     {
  //       name: "",
  //       value: (motorConnectorValue / results.motor_power) * 100,
  //       x: .5,
  //       y: .6,
  //       source: 2,
  //       target: [4, 5],
  //       isConnector: true,
  //       nodeColor: this.nodeStartColor,
  //       id: 'motorConnector'
  //     },
  //     {
  //       name: "Motor Losses " + this.decimalPipe.transform(this.motor, '1.0-0') + " kW",
  //       value: (this.motor / results.motor_power) * 100,
  //       x: .5,
  //       y: .10,
  //       source: 3,
  //       target: [],
  //       isConnector: false,
  //       nodeColor: this.nodeArrowColor,
  //       id: 'motorLosses'
  //     },
  //   );
  //   if (this.drive > 0) {
  //     nodes.push(
  //       {
  //         name: "Drive Losses " + this.decimalPipe.transform(this.drive, '1.0-0') + "kW",
  //         value: (this.drive / results.motor_power) * 100,
  //         x: .6,
  //         y: .25,
  //         source: 4,
  //         target: [],
  //         isConnector: false,
  //         nodeColor: this.nodeArrowColor,
  //         id: 'driveLosses'
  //       },
  //       {
  //         name: "",
  //         value: (driveConnectorValue / results.motor_power) * 100,
  //         x: .7,
  //         y: .6,
  //         source: 5,
  //         target: [6,7],
  //         isConnector: true,
  //         nodeColor: this.nodeStartColor,
  //         id: 'driveConnector'
  //       },
  //     );
  //   }
  //   nodes.push(
  //     {
  //       name: "Pump Losses " + this.decimalPipe.transform(this.pump, '1.0-0') + "kW",
  //       value: (this.pump / results.motor_power) * 100,
  //       x: .8,
  //       y: .15,
  //       source: this.drive > 0 ? 6 : 4,
  //       target: [],
  //       isConnector: false,
  //       nodeColor: this.nodeArrowColor,
  //       id: 'pumpLosses'
  //     },
  //     {
  //       name: "Useful Output " + this.decimalPipe.transform(usefulOutput, '1.0-0') + " kW",
  //       value: (usefulOutput / results.motor_power) * 100,
  //       x: .85,
  //       y: .65,
  //       source: this.drive > 0 ? 7 : 5,
  //       target: [],
  //       isConnector: false,
  //       nodeColor: this.nodeArrowColor,
  //       id: 'usefulOutput'
  //     }
  //   );

  //   return nodes;
  // }

  // buildLinks(nodes, links) {
  //   this.connectingLinkPaths.push(0);

  //   for (let i = 0; i < nodes.length; i++) {
  //     if (nodes[i].isConnector) {
  //         this.connectingNodes.push(i); 
  //         if (i !== 0 && i-1 !== 0) {
  //           this.connectingLinkPaths.push(i - 1);
  //         }
  //     }
  //     for (let j = 0; j < nodes[i].target.length; j++) {
  //         links.push(
  //           {
  //             source: nodes[i].source,
  //             target: nodes[i].target[j]
  //           }
  //         )
  //       }
  //   }
  // }

  // buildSvgArrows() {
  //   const rects = this._dom.nativeElement.querySelectorAll('.node-rect');
  //   const arrowOpacity = '0.9';
  //   const arrowShape = 'polygon(100% 50%, 0 0, 0 100%)'

  //   for (let i = 0; i < rects.length; i++) {
  //     if (!this.connectingNodes.includes(i)) {
  //       const height = rects[i].getAttribute('height');
  //       const defaultY = rects[i].getAttribute('y');

  //       rects[i].setAttribute('y', `${defaultY - (height / 2.75)}`);
  //       rects[i].setAttribute('style', `width: ${height}px; height: ${height * 1.75}px; clip-path:  ${arrowShape}; 
  //        stroke-width: 0.5; stroke: rgb(255, 255, 255); stroke-opacity: 0.5; fill: ${this.gradientEndColor}; fill-opacity: ${arrowOpacity};`);
  //     }
  //   }
  // }

  // addGradientElement(): void {
  //   const mainSVG = this._dom.nativeElement.querySelector('.main-svg')
  //   const svgDefs = this._dom.nativeElement.querySelector('defs')

  //   svgDefs.innerHTML = `
  //   <linearGradient id="psatLinkGradient">
  //     <stop offset="10%" stop-color="${this.gradientStartColor}" />
  //     <stop offset="100%" stop-color="${this.gradientEndColor}" />
  //   </linearGradient>
  //   `
  //   // Insert our gradient Def
  //   this.renderer.appendChild(mainSVG, svgDefs);
  // }

}
