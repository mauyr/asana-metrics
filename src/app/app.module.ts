import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TimeSpendedPipe } from './pipe/time-spended.pipe';
import { MatSidenavModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule
  ],
  exports: [
    MatSidenavModule
  ],
  providers: [TimeSpendedPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
