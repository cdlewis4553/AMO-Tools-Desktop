import { Component, OnInit } from '@angular/core';
import { AnalysisGraphItem, WasteWaterAnalysisService } from '../../waste-water-analysis/waste-water-analysis.service';

@Component({
  selector: 'app-srt-graphs',
  templateUrl: './srt-graphs.component.html',
  styleUrls: ['./srt-graphs.component.css']
})
export class SrtGraphsComponent implements OnInit {

  analysisGraphItems: Array<AnalysisGraphItem>;
  constructor(private wasteWaterAnalysisService: WasteWaterAnalysisService) { }

  ngOnInit(): void {
    let reportGraphVariables: Array<string> = [
      'Se',
      'MLVSS',
      'MLSS',
      'SludgeProd',
      'SolidProd',
      'OxygenRqd'
    ]

    this.analysisGraphItems = this.wasteWaterAnalysisService.getAnalysisGraphItems(this.wasteWaterAnalysisService.baselineResults, this.wasteWaterAnalysisService.modificationsResultsArr);
    this.analysisGraphItems = this.analysisGraphItems.filter(graphItem => {
      return reportGraphVariables.includes(graphItem.dataVariable.name)
    });
  }

}
