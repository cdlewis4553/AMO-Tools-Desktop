import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { SankeyNode, SankeyData, SankeyColors } from './sankey.model';
import * as Plotly from 'plotly.js';
import { SankeyService } from './sankey.service';

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.css']
})
export class SankeyComponent implements OnInit {
  @Input()
  sankeyData: SankeyData
  @Input()
  sankeyColors: SankeyColors;

  @ViewChild("sankeyDiagram", { static: false }) sankeyDiagram: ElementRef;
  links: Array<{ source: number, target: number }>;
  nodes: Array<SankeyNode>;
  connectingNodes: Array<number> = [];
  connectingLinkPaths: Array<number> = [];

  constructor(
    private _dom: ElementRef,
    private renderer: Renderer2,
    private sankeyService: SankeyService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getNodesAndLinks();
    this.buildConnectors();
    this.createSankey();
  }

  ngOnChanges() {
    if (this.sankeyDiagram) {
      this.getNodesAndLinks();
      this.buildConnectors();
      this.createSankey();
    }
  }

  getNodesAndLinks(){
    let nodesAndLinks = this.sankeyService.getNodesAndLinks(this.sankeyData, 'kW', this.sankeyColors);
    this.nodes = nodesAndLinks.nodes;
    this.links = nodesAndLinks.links;
  }

  closeSankey() {
    Plotly.purge(this.sankeyDiagram.nativeElement);
  }

  createSankey() {
    this.closeSankey();
    const sankeyLink = {
      value: this.nodes.map(node => node.value),
      source: this.links.map(link => link.source),
      target: this.links.map(link => link.target),
      hoverinfo: 'none',
      line: {
        color: this.sankeyColors.nodeStartColor,
        width: 0
      },
    };

    const sankeyData = {
      type: "sankey",
      orientation: "h",
      valuesuffix: "%",
      ids: this.nodes.map(node => node.id),
      textfont: {
        color: 'rgba(0, 0, 0)',
        size: 16
      },
      arrangement: 'freeform',
      node: {
        pad: 50,
        line: {
          color: this.sankeyColors.nodeStartColor,
          width: 0
        },
        label: this.nodes.map(node => node.name),
        x: this.nodes.map(node => node.x),
        y: this.nodes.map(node => node.y),
        color: this.nodes.map(node => node.nodeColor),
        hoverinfo: 'all',
        hovertemplate: '%{value}<extra></extra>',
        hoverlabel: {
          font: {
            size: 16,
            color: 'rgba(255, 255, 255)'
          },
          align: 'auto',
        }
      },
      link: sankeyLink
    };

    const layout = {
      title: "",
      autosize: true,
      yaxis: {
        automargin: true,
      },
      xaxis: {
        automargin: true,
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: {
        l: 50,
        t: 100,
        pad: 300,
      }
    };

    const config = {
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
      responsive: true
    };

    Plotly.react(this.sankeyDiagram.nativeElement, [sankeyData], layout, config);
    this.addGradientElement();
    this.buildSvgArrows();
  }

  buildConnectors() {
    this.connectingLinkPaths.push(0);
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].isConnector) {
        this.connectingNodes.push(i);
        if (i !== 0 && i - 1 !== 0) {
          this.connectingLinkPaths.push(i - 1);
        }
      }
    }
  }

  buildSvgArrows() {
    const rects = this._dom.nativeElement.querySelectorAll('.node-rect');
    const arrowOpacity = '0.9';
    const arrowShape = 'polygon(100% 50%, 0 0, 0 100%)'

    for (let i = 0; i < rects.length; i++) {
      if (!this.connectingNodes.includes(i)) {
        const height = rects[i].getAttribute('height');
        const defaultY = rects[i].getAttribute('y');

        rects[i].setAttribute('y', `${defaultY - (height / 2.75)}`);
        rects[i].setAttribute('style', `width: ${height}px; height: ${height * 1.75}px; clip-path:  ${arrowShape}; 
         stroke-width: 0.5; stroke: rgb(255, 255, 255); stroke-opacity: 0.5; fill: ${this.sankeyColors.gradientEndColor}; fill-opacity: ${arrowOpacity};`);
      }
    }
  }

  addGradientElement(): void {
    const mainSVG = this._dom.nativeElement.querySelector('.main-svg')
    const svgDefs = this._dom.nativeElement.querySelector('defs')

    svgDefs.innerHTML = `
    <linearGradient id="linkGradient">
      <stop offset="10%" stop-color="${this.sankeyColors.gradientStartColor}" />
      <stop offset="100%" stop-color="${this.sankeyColors.gradientEndColor}" />
    </linearGradient>
    `
    // Insert our gradient Def
    this.renderer.appendChild(mainSVG, svgDefs);
  }
}
