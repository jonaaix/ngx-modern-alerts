import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs";
import { NgxModernAlert } from '../../core/ngx-modern-alert';

@Component({
   selector: 'ngx-modern-alert-layer',
   templateUrl: './ngx-modern-alert-layer.component.html',
   styleUrls: ['./ngx-modern-alert-layer.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
})
export class NgxModernAlertLayerComponent {
   public bannerAlerts: NgxModernAlert[] = [];
   public floatingAlerts: NgxModernAlert[] = [];

   public dismissAlert$: Subject<NgxModernAlert> = new Subject<NgxModernAlert>();

   constructor(public cdRef: ChangeDetectorRef) {}

   public setDisplayAlerts(alerts: NgxModernAlert[]): void {
      this.bannerAlerts = alerts.filter((a) => a.overlayType === 'banner');
      this.floatingAlerts = alerts.filter((a) => a.overlayType === 'floating');
      this.cdRef.markForCheck();
   }

   public dismissAlert(alert: NgxModernAlert): void {
      this.dismissAlert$.next(alert);
   }

   public trackById(index: number, alert: NgxModernAlert): string {
      return alert.id;
   }
}
