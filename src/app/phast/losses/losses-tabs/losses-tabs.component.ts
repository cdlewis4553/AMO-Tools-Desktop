import { Component, OnInit, Input } from '@angular/core';
import { PHAST } from '../../../shared/models/phast/phast';
import { Settings } from '../../../shared/models/settings';
import { LossesService } from '../losses.service';
import { LossTab } from '../../tabs';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-losses-tabs',
  templateUrl: './losses-tabs.component.html',
  styleUrls: ['./losses-tabs.component.css']
})
export class LossesTabsComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  phast: PHAST;
  @Input()
  inSetup: boolean;
  
  selectedTab: LossTab;

  lossTabs: Array<LossTab>;
  lossesTabSub: Subscription;
  constructor(private lossesService: LossesService) { }

  ngOnInit() {
    this.lossTabs = this.lossesService.lossesTabs;
    this.lossesTabSub = this.lossesService.lossesTab.subscribe(val => {
      this.selectedTab = this.lossesService.getTab(val);
    });
  }

  ngOnDestroy(){
    this.lossesTabSub.unsubscribe();
  }

  tabChange(tab: LossTab) {
    this.lossesService.lossesTab.next(tab.step);
  }
}
