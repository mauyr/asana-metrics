import { TestBed } from '@angular/core/testing';

import { AsanaService } from './asana.service';

describe('AsanaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsanaService = TestBed.get(AsanaService);
    expect(service).toBeTruthy();
  });
});
