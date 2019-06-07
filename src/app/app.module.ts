import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TimeSpentPipe } from './pipe/time-spent.pipe';
import { MatSidenavModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule,
    MatSidenavModule
  ],
  exports: [
    MatSidenavModule
  ],
  providers: [TimeSpentPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
