import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../shared/models/settings';
import { Assessment } from '../../shared/models/assessment';
import { Directory } from '../../shared/models/directory';
import { DirectoryDbService } from '../../indexedDb/directory-db.service';
import { TreasureHuntResults, OpportunitiesPaybackDetails, OpportunitySummary } from '../../shared/models/treasure-hunt';
import { TreasureHuntReportService } from './treasure-hunt-report.service';
import { OpportunityPaybackService } from './opportunity-payback.service';
import { OpportunitySummaryService } from './opportunity-summary.service';

@Component({
  selector: 'app-treasure-hunt-report',
  templateUrl: './treasure-hunt-report.component.html',
  styleUrls: ['./treasure-hunt-report.component.css']
})
export class TreasureHuntReportComponent implements OnInit {
  @Input()
  assessment: Assessment;
  @Input()
  settings: Settings;
  @Input()
  directory: Directory;
  @Input()
  containerHeight: number;
  @Input()
  inRollup: boolean;
  @Input()
  printView: boolean;

  currentTab: string = 'executiveSummary';
  assessmentDirectories: Array<Directory> = [];
  dataCalculated: boolean = true;
  treasureHuntResults: TreasureHuntResults;
  opportunitiesPaybackDetails: OpportunitiesPaybackDetails;
  constructor(private directoryDbService: DirectoryDbService, private treasureHuntReportService: TreasureHuntReportService,
    private opportunityPaybackService: OpportunityPaybackService, private opportunitySummaryService: OpportunitySummaryService) { }

  ngOnInit() {
    if (this.assessment) {
      this.getDirectoryList(this.assessment.id);
    }
    if (this.assessment.treasureHunt.setupDone == true) {
      // this.treasureHuntResults = this.treasureHuntReportService.calculateTreasureHuntResults(this.assessment.treasureHunt, this.settings);
      let opportunitySummaries: Array<OpportunitySummary> = this.opportunitySummaryService.getOpportunitySummaries(this.assessment.treasureHunt, this.settings);
      this.treasureHuntResults = this.treasureHuntReportService.calculateTreasureHuntResultsFromSummaries(this.assessment.treasureHunt.currentEnergyUsage, opportunitySummaries)
      this.opportunitiesPaybackDetails = this.opportunityPaybackService.getOpportunityPaybackDetails(this.treasureHuntResults.opportunitySummaries);
    }



    if (this.inRollup) {
      this.setTab('opportunitySummary');
    }
  }

  setTab(str: string) {
    this.currentTab = str;
  }

  getDirectoryList(id: number) {
    // if (id && id !== 1) {
    //   let results = this.directoryDbService.getById(id);
    //   this.assessmentDirectories.push(results);
    //   if (results.parentDirectoryId !== 1) {
    //     this.getDirectoryList(results.parentDirectoryId);
    //   }
    // }
  }

}
