import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { NgxModernAlert } from '../../core/ngx-modern-alert';

@Component({
   selector: 'ngx-modern-alert-layer',
   templateUrl: './ngx-modern-alert-layer.component.html',
   styleUrls: ['./ngx-modern-alert-layer.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
})
export class NgxModernAlertLayerComponent {
   public alerts: NgxModernAlert[] = [];
   public bannerAlerts: NgxModernAlert[] = [];
   public floatingAlerts: NgxModernAlert[] = [];

   constructor(public cdRef: ChangeDetectorRef) {}

   /**
    * Set Display Alerts
    */
   public setDisplayAlerts(alerts: NgxModernAlert[]): void {
      this.bannerAlerts = alerts.filter((a) => a.overlayType === 'banner');
      this.floatingAlerts = alerts.filter((a) => a.overlayType === 'floating');
      this.cdRef.markForCheck();
   }
}
