import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PSAT, Modification, PsatOutputs } from '../../shared/models/psat';
import { Assessment } from '../../shared/models/assessment';
import { Settings } from '../../shared/models/settings';
import { PsatService } from '../psat.service';

@Component({
  selector: 'app-explore-opportunities',
  templateUrl: './explore-opportunities.component.html',
  styleUrls: ['./explore-opportunities.component.css']
})
export class ExploreOpportunitiesComponent implements OnInit {
  @Input()
  assessment: Assessment;
  @Input()
  saveClicked: boolean;
  @Input()
  settings: Settings;
  @Output('saved')
  saved = new EventEmitter<boolean>();
  @Input()
  psat: PSAT;

  annualSavings: number;
  optimizationRating: number;
  title: string;
  unit: string;
  titlePlacement: string;
  tmpNewPumpType: string;
  tmpInitialPumpType: string;
  tmpNewEfficiencyClass: string;
  tmpInitialEfficiencyClass: string;
  testVal: string;

  baselineResults: PsatOutputs;
  modificationResults: PsatOutputs;
  isFirstChange: boolean = true;
  exploreModIndex: number = 0;

  tabSelect: string = 'results';
  currentField: string;
  baselineOptimizationRating: number;
  baselineSavingsPotential: number;
  constructor(private psatService: PsatService) { }

  ngOnInit() {
    // this.psat = JSON.parse(JSON.stringify(this.assessment.psat));
    if (!this.psat.modifications) {
      this.psat.modifications = new Array();
      this.psat.modifications.push({
        notes: {
          systemBasicsNotes: '',
          pumpFluidNotes: '',
          motorNotes: '',
          fieldDataNotes: ''
        },
        psat: {
          inputs: JSON.parse(JSON.stringify(this.assessment.psat.inputs))
        },
        exploreOpportunities: true
      });
      this.exploreModIndex = 0;
      this.psat.modifications[this.exploreModIndex].psat.name = 'Opportunities Modification'
    } else {
      let i = 0;
      let exists = false;
      //find explore opportunites modificiation
      this.psat.modifications.forEach(mod => {
        if (mod.exploreOpportunities) {
          this.exploreModIndex = i;
          exists = true;
        } else {
          i++;
        }
      })
      //none found add one
      if (!exists) {
        this.psat.modifications.push({
          notes: {
            systemBasicsNotes: '',
            pumpFluidNotes: '',
            motorNotes: '',
            fieldDataNotes: ''
          },
          psat: {
            inputs: JSON.parse(JSON.stringify(this.assessment.psat.inputs))
          },
          exploreOpportunities: true
        });
        this.exploreModIndex = this.psat.modifications.length - 1;
        this.psat.modifications[this.exploreModIndex].psat.name = 'Opportunities Modification'
      }
    }

    this.title = 'Potential Adjustment';
    this.unit = '%';
    this.titlePlacement = 'top';
    this.getResults();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstChange) {
      if (changes.saveClicked) {
        this.save();
      }
    } else {
      this.isFirstChange = false;
    }
  }

  getResults() {
    //create copies of inputs to use for calcs
    let psatInputs = JSON.parse(JSON.stringify(this.psat.inputs));
    let modInputs = JSON.parse(JSON.stringify(this.psat.modifications[this.exploreModIndex].psat.inputs));
    this.baselineResults = this.psatService.resultsExisting(psatInputs, this.settings);
    this.modificationResults = this.psatService.resultsExisting(modInputs, this.settings);
    this.annualSavings = this.baselineResults.annual_cost - this.modificationResults.annual_cost;
    this.optimizationRating = Number((Math.round(this.modificationResults.optimization_rating * 100 * 100) / 100).toFixed(0));
    this.baselineOptimizationRating = Number((Math.round(this.baselineResults.optimization_rating * 100 * 100) / 100).toFixed(0));
    this.baselineSavingsPotential = this.baselineResults.annual_savings_potential;
  }

  save() {
    //this.assessment.psat = this.psat;
    this.saved.emit(true);
  }
  setTab(str: string) {
    this.tabSelect = str;
  }

  focusField($event) {
    this.currentField = $event;
  }
}
