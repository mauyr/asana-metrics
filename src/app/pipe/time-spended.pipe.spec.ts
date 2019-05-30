import { TestBed } from '@angular/core/testing';
import { TimeSpendedPipe } from './time-spended.pipe';

describe('TimeSpendedPipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeSpendedPipe = TestBed.get(TimeSpendedPipe);
    expect(service).toBeTruthy();
  });

});
