import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapFocusComponent } from './roadmap-focus.component';

describe('RoadmapFocusComponent', () => {
  let component: RoadmapFocusComponent;
  let fixture: ComponentFixture<RoadmapFocusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadmapFocusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadmapFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
