import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SankeyData, SankeyNode, SankeyColors } from './sankey.model';
import * as _ from 'lodash';

@Injectable()
export class SankeyService {

  constructor(private decimalPipe: DecimalPipe) { }

  getNodesAndLinks(sankeyData: SankeyData, unit: string, sankeyColors: SankeyColors): { links: Array<{ source: number, target: number }>, nodes: Array<SankeyNode> } {
    let nodes: Array<SankeyNode> = this.getNodes(sankeyData, unit, sankeyColors);
    let links: Array<{ source: number, target: number }> = this.getLinks(nodes);
    //build logic
    return { links: links, nodes: nodes };
  }

  getLinks(nodes: Array<SankeyNode>): Array<{ source: number, target: number }> {
    let links: Array<{ source: number, target: number }> = new Array();
    nodes.forEach(node => {
      node.targets.forEach(target => {
        links.push({
          source: node.source,
          target: target
        })
      })
    });
    return links;
  }


  getNodes(sankeyData: SankeyData, unit: string, sankeyColors: SankeyColors): Array<SankeyNode> {
    sankeyData.losses = _.orderBy(sankeyData.losses, ['value'], ['desc']);
    let nodes: Array<SankeyNode> = new Array();
    //total percent energy remaining
    let totalEnergyRemaining: number = 100;
    //total number of losses
    //TODO: add consideration for additions (loop backs)
    let numLosses: number = sankeyData.losses.length;
    //start position of energy input
    let xStart: number = .1;
    //end position of energy out
    let xEnd: number = .85;
    //even steps from input to output
    //TODO: if numLosses > some number, use half and alternate y values +/-
    let xStep: number = (xEnd - xStart - .05) / (numLosses + 1);
    //x position as we move through nodes with be updated by step.
    let x: number = xStart + xStep;
    let y: number = .05;
    let yConstant: number = .5;
    //index of node source
    let sourceIndex: number = 0;
    //start by adding energy input
    nodes.push({
      name: "Energy Input " + this.decimalPipe.transform(sankeyData.energyInput, '1.0-0') + " " + unit,
      value: 100,
      x: xStart,
      y: yConstant,
      source: sourceIndex,
      targets: [1],
      isConnector: true,
      nodeColor: sankeyColors.nodeStartColor,
      id: 'originConnector',
      width: 1
    });
    sourceIndex++;

    //iterate losses and add connector and loss nodes
    sankeyData.losses.forEach(loss => {
      //add connector
      //subtract off the loss % from total remaining energy before adding connector
      totalEnergyRemaining = totalEnergyRemaining - (loss.value / sankeyData.energyInput * 100);
      //add connector
      nodes = this.addConnector(nodes, totalEnergyRemaining, sourceIndex, sankeyColors, x, yConstant, 2);
      //iterate index
      sourceIndex++;
      //put the loss halfway betwee connector for loss and next node
      let lossXValue: number = (x + (xStep / 2));
      nodes = this.addLoss(nodes, loss, sankeyData.energyInput, sourceIndex, sankeyColors, unit, lossXValue, y);
      y = y + .1
      //iterate index
      sourceIndex++;
      //update x position before continuing
      x = x + xStep;
    })
    //TODO: iterate additions?

    //finish by adding output node
    if (sankeyData.outputEnergy.length != 1) {
      let sumOutputEnergy: number = _.sumBy(sankeyData.outputEnergy, 'value');
      totalEnergyRemaining = totalEnergyRemaining - (sumOutputEnergy / sankeyData.energyInput * 100);
      //add connector
      nodes = this.addConnector(nodes, totalEnergyRemaining, sourceIndex, sankeyColors, x, yConstant, sankeyData.outputEnergy.length + 1);
      //iterate index
      sourceIndex++;
    }

    let outputEnergyYStep: number = 1 / (sankeyData.outputEnergy.length + 1);
    let outputEnergyY: number = 1 / (sankeyData.outputEnergy.length + 1);
    sankeyData.outputEnergy.forEach(output => {
      this.addOutputEnergy(nodes, output, sankeyData.energyInput, sourceIndex, sankeyColors, 'kW', xEnd, outputEnergyY);
      outputEnergyY = outputEnergyY + outputEnergyYStep;
      sourceIndex++;
    });
    console.log(nodes);
    return nodes;
  }

  //connector node
  addConnector(nodes: Array<SankeyNode>, remainingValue: number, sourceIndex: number, sankeyColors: SankeyColors, x: number, y: number, numTargets: number): Array<SankeyNode> {
    let targets: Array<number> = [(sourceIndex + numTargets)];
    for (let i = sourceIndex + 1; i < (sourceIndex + numTargets); i++) {
      targets.push(i);
    }

    //not sure why the targets have to be in this order but it works..
    nodes.push({
      name: "",
      value: remainingValue,
      x: x,
      y: y,
      source: sourceIndex,
      targets: targets,
      isConnector: true,
      nodeColor: sankeyColors.nodeStartColor,
      id: 'inputConnector',
      width: 1
    });
    return nodes;
  }

  //loss node
  addLoss(nodes: Array<SankeyNode>, loss: { label: string, value: number }, energyInput: number, sourceIndex: number, sankeyColors: SankeyColors, unit: string, x: number, y: number): Array<SankeyNode> {
    nodes.push({
      name: loss.label + " " + this.decimalPipe.transform(loss.value, '1.0-0') + " " + unit,
      value: (loss.value / energyInput) * 100,
      x: x,
      y: y,
      source: sourceIndex,
      targets: [],
      isConnector: false,
      nodeColor: sankeyColors.nodeArrowColor,
      id: 'loss',
      width: 1
    });
    return nodes;
  }

  //add output energy
  addOutputEnergy(nodes: Array<SankeyNode>, outputEnergy: { label: string, value: number }, energyInput: number, sourceIndex: number, sankeyColors: SankeyColors, unit: string, x: number, y: number) {
    nodes.push({
      name: outputEnergy.label + " " + this.decimalPipe.transform(outputEnergy.value, '1.0-0') + " " + unit,
      value: (outputEnergy.value / energyInput) * 100,
      x: x,
      y: y,
      source: sourceIndex,
      targets: [],
      isConnector: false,
      nodeColor: sankeyColors.nodeArrowColor,
      id: 'usefulOutput',
      width: 1
    });
  }
}
