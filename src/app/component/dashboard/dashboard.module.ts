import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
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
    BrowserAnimationsModule,
    NoopAnimationsModule
  ]
})
export class DashboardModule { }
