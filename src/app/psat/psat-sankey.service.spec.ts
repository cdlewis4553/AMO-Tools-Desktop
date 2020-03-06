import { TestBed } from '@angular/core/testing';

import { PsatSankeyService } from './psat-sankey.service';

describe('PsatSankeyService', () => {
  let service: PsatSankeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsatSankeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
