import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.css']
})
export class HelpPanelComponent implements OnInit {
  @Input()
  displayHeader: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
