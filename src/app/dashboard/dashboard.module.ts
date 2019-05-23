import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

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
    LayoutModule
  ],
  exports: [
    DashboardComponent, 
    MatButtonModule, 
    MatCheckboxModule, 
    FlexLayoutModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ]
})
export class DashboardModule { }
