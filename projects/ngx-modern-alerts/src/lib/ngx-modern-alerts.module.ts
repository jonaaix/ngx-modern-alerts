import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxModernAlertComponent } from './components/ngx-modern-alert/ngx-modern-alert.component';
import { NgxModernAlertHubComponent } from './components/ngx-modern-alert-hub/ngx-modern-alert-hub.component';
import { NgxModernAlertLayerComponent } from './components/ngx-modern-alert-layer/ngx-modern-alert-layer.component';

@NgModule({
   declarations: [NgxModernAlertComponent, NgxModernAlertLayerComponent, NgxModernAlertHubComponent],
   imports: [CommonModule, OverlayModule],
   exports: [NgxModernAlertComponent, NgxModernAlertLayerComponent, NgxModernAlertHubComponent],
   providers: [],
})
export class NgxModernAlertsModule {}
