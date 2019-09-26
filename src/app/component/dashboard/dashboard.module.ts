import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { ChartsModule } from 'ng2-charts';
import { ProposalComponent } from './proposal/proposal.component';
import { VelocityComponent } from './velocity/velocity.component';
import { PriorizedEstimateComponent } from './priorized-estimate/priorized-estimate.component';
import { RoadmapFocusComponent } from './roadmap-focus/roadmap-focus.component';
import { PriorizedBacklogEvolutionComponent } from './priorized-backlog-evolution/priorized-backlog-evolution.component';
import { DevelopmentDivisionComponent } from './development-division/development-division.component';
import { LeadTimeComponent } from './lead-time/lead-time.component';

@NgModule({
  declarations: [DashboardComponent, ProposalComponent, VelocityComponent, PriorizedEstimateComponent, RoadmapFocusComponent, PriorizedBacklogEvolutionComponent, DevelopmentDivisionComponent, LeadTimeComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    LayoutModule,
    ChartsModule,
    PipeModule.forRoot()
  ],
  exports: [
    DashboardComponent, 
    MatButtonModule, 
    MatCheckboxModule, 
    MatProgressBarModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ]
})
export class DashboardModule { }
