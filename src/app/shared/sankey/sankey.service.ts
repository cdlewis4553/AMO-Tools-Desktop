import { Injectable } from '@angular/core';
import { SankeyData, SankeyNode, SankeyColors } from '../models/psat/sankey.model';
import { DecimalPipe } from '@angular/common';

@Injectable()
export class SankeyService {

  constructor(private decimalPipe: DecimalPipe) { }

  getNodesAndLinks(sankeyData: SankeyData, unit: string, sankeyColors: SankeyColors): { links: Array<{ source: number, target: number }>, nodes: Array<SankeyNode> } {
    let nodes: Array<SankeyNode> = this.getNodes(sankeyData, unit);
    let links: Array<{ source: number, target: number }> = this.getLinks(nodes);
    //build logic
    return { links: links, nodes: nodes };
  }

  getLinks(nodes: Array<SankeyNode>): Array<{source: number, target:number}>{
    let links:  Array<{source: number, target:number}> = new Array();
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
    //start energy input
    let sourceIndex: number = 0;
    nodes.push({
        name: "Energy Input " + this.decimalPipe.transform(sankeyData, '1.0-0') + " " + unit,
        value: 100,
        x: .1,
        y: .6,
        source: sourceIndex,
        targets: [1,2],
        isConnector: true,
        nodeColor: sankeyColors.nodeStartColor,
        id: 'originConnector'
    });
    sourceIndex++;
    //add connector

    //add losses
    //iterate losses
    //iterate additions?
    //add output node

    return nodes;
  }

  // addConnector(nodes: Array<SankeyNode>): Array<SankeyNode>{
  //   nodes.push(      {
  //     name: "",
  //     value: 0,
  //     x: .25,
  //     y: .6,
  //     source: 1,
  //     target: [2, 3],
  //     isConnector: true,
  //     nodeColor: this.nodeStartColor,
  //     id: 'inputConnector'
  //   },)
  // }
}
