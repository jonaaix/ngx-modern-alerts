import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxModernAlertsModule } from '../../projects/ngx-modern-alerts/src/lib/ngx-modern-alerts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
   declarations: [AppComponent],
   imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, NgxModernAlertsModule],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
