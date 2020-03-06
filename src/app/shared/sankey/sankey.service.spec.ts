import { TestBed } from '@angular/core/testing';

import { SankeyService } from './sankey.service';

describe('SankeyService', () => {
  let service: SankeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SankeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
