import { TestBed } from '@angular/core/testing';

import { PumpsApiService } from './pumps-api.service';

describe('PumpsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PumpsApiService = TestBed.get(PumpsApiService);
    expect(service).toBeTruthy();
  });
});
