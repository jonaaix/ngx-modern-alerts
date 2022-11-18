import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgxModernAlertsModule } from '../../projects/ngx-modern-alerts/src/lib/ngx-modern-alerts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxModernAlertService } from "../../projects/ngx-modern-alerts/src/lib/services/ngx-modern-alert.service";

@NgModule({
   declarations: [AppComponent],
   imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, NgxModernAlertsModule],
   providers: [NgxModernAlertService],
   bootstrap: [AppComponent],
})
export class AppModule {}
