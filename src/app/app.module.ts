import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxModernAlertModule } from '../../projects/ngx-modern-alerts/src/lib/ngx-modern-alert.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
   declarations: [AppComponent],
   imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, NgxModernAlertModule],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
