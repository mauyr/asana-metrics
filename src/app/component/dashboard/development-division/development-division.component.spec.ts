import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentDivisionComponent } from './development-division.component';

describe('DevelopmentDivisionComponent', () => {
  let component: DevelopmentDivisionComponent;
  let fixture: ComponentFixture<DevelopmentDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
