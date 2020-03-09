import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SankeyData, SankeyNode, SankeyColors } from './sankey.model';

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
    let xStep: number = (xEnd - xStart) / (numLosses + 1);
    //x position as we move through nodes with be updated by step.
    let x: number = xStart + xStep;
    // let y: number = .6;
    //index of node source
    let sourceIndex: number = 0;
    //start by adding energy input
    nodes.push({
      name: "Energy Input " + this.decimalPipe.transform(sankeyData.energyInput, '1.0-0') + " " + unit,
      value: 100,
      x: xStart,
      y: .6,
      source: sourceIndex,
      targets: [1],
      isConnector: true,
      nodeColor: sankeyColors.nodeStartColor,
      id: 'originConnector'
    });
    sourceIndex++;

    //iterate losses and add connector and loss nodes
    sankeyData.losses.forEach(loss => {
      //add connector
      //subtract off the loss % from total remaining energy before adding connector
      totalEnergyRemaining = totalEnergyRemaining - (loss.value / sankeyData.energyInput * 100);
      //add connector
      nodes = this.addConnector(nodes, totalEnergyRemaining, sourceIndex, sankeyColors, x, .6);
      //iterate index
      sourceIndex++;
      //put the loss halfway betwee connector for loss and next node
      let lossXValue: number = (x + (xStep / 2));
      nodes = this.addLoss(nodes, loss, sankeyData.energyInput, sourceIndex, sankeyColors, unit, lossXValue, .2);
      //iterate index
      sourceIndex++;
      //update x position before continuing
      x = x + xStep;
    })
    //TODO: iterate additions?

    //finish by adding output node
    nodes.push({
      name: "Useful Output " + this.decimalPipe.transform(sankeyData.outputEnergy, '1.0-0') + " " + unit,
      value: (sankeyData.outputEnergy / sankeyData.energyInput) * 100,
      x: xEnd,
      y: .6,
      source: sourceIndex,
      targets: [],
      isConnector: false,
      nodeColor: sankeyColors.nodeArrowColor,
      id: 'usefulOutput'
    });
    console.log(nodes);
    return nodes;
  }

  //connector node
  addConnector(nodes: Array<SankeyNode>, remainingValue: number, sourceIndex: number, sankeyColors: SankeyColors, x: number, y: number): Array<SankeyNode> {
    //not sure why the targets have to be in this order but it works..
    nodes.push({
      name: "",
      value: remainingValue,
      x: x,
      y: y,
      source: sourceIndex,
      targets: [(sourceIndex + 2), (sourceIndex + 1)],
      isConnector: true,
      nodeColor: sankeyColors.nodeStartColor,
      id: 'inputConnector'
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
      id: 'loss'
    });
    return nodes;
  }
}
