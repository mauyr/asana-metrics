import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizedEstimateComponent } from './priorized-estimate.component';

describe('PriorizedEstimateComponent', () => {
  let component: PriorizedEstimateComponent;
  let fixture: ComponentFixture<PriorizedEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorizedEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorizedEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
