import { TestBed } from '@angular/core/testing';
import { TimeSpentPipe } from './time-spent.pipe';

describe('TimeSpentPipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeSpentPipe = TestBed.get(TimeSpentPipe);
    expect(service).toBeTruthy();
  });

});
