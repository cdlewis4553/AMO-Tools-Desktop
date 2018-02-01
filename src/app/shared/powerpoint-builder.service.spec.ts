import { TestBed, inject } from '@angular/core/testing';

import { PowerpointBuilderService } from './powerpoint-builder.service';

describe('PowerpointBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PowerpointBuilderService]
    });
  });

  it('should be created', inject([PowerpointBuilderService], (service: PowerpointBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
