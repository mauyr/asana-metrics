import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizedBacklogEvolutionComponent } from './priorized-backlog-evolution.component';

describe('PriorizedBacklogEvolutionComponent', () => {
  let component: PriorizedBacklogEvolutionComponent;
  let fixture: ComponentFixture<PriorizedBacklogEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorizedBacklogEvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorizedBacklogEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
