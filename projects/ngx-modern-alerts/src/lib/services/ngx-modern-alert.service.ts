import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NgxModernAlertLayerComponent } from '../components/ngx-modern-alert-layer/ngx-modern-alert-layer.component';
import { NgxModernAlert, NgxModernAlertLevel, NgxModernAlertOverlayType } from '../core/ngx-modern-alert';

type HtmlString = string;

@Injectable()
export class NgxModernAlertService implements OnDestroy {
   private subscriptions: Subscription[] = [];
   public alerts: NgxModernAlert[] = [];
   public displayAlerts: NgxModernAlert[] = [];

   /** Maximum number of overlay messages */
   public maxMessages: number = 5;

   /** Maximum display duration in ms*/
   public timeoutMs: number = 5000;

   /** Notification overlay X position */
   public xPosition: 'right' | 'left' = 'right';

   /** Notification overlay Y position */
   public yPosition: 'top' | 'bottom' = 'top';

   public xOffset: string = '0';
   public yOffset: string = '0';

   private cdkOverlayRef!: OverlayRef;

   private alertLayerComponentRef!: ComponentRef<NgxModernAlertLayerComponent>;

   constructor(private overlay: Overlay, private domSanitizer: DomSanitizer) {
      this.init();
   }

   ngOnDestroy(): void {
      this.subscriptions.forEach((s) => s.unsubscribe());
   }

   /**
    * Init
    * TODO: Add action buttons
    * TODO: copy to clipboard
    * TODO: download screenshot
    * TODO: custom Action
    */
   private init(): void {
      this.cdkOverlayRef = this.overlay.create({
         panelClass: 'ngx-modern-alert-layer-panel',
      });

      // Create a ComponentPortal that can be attached to the PortalHost
      const componentPortal = new ComponentPortal(NgxModernAlertLayerComponent);
      this.alertLayerComponentRef = this.cdkOverlayRef.attach(componentPortal);

      switch (this.xPosition) {
         case 'right':
            this.cdkOverlayRef.overlayElement.style.right = this.xOffset;
            break;
         case 'left':
            this.cdkOverlayRef.overlayElement.style.left = this.xOffset;
            break;
      }

      switch (this.yPosition) {
         case 'top':
            this.cdkOverlayRef.overlayElement.style.top = this.yOffset;
            break;
         case 'bottom':
            this.cdkOverlayRef.overlayElement.style.bottom = this.yOffset;
            break;
      }

      this.subscriptions.push(
         this.alertLayerComponentRef.instance.dismissAlert$.subscribe((alert) => {
            this.dismissAlert(alert);
         })
      );
   }

   /**
    * Dismiss Alert
    */
   public dismissAlert(alert: NgxModernAlert): void {
      const alertRef = this.alerts.find((a) => a.id === alert.id);
      if (alertRef) {
         alertRef.dismissedAt = new Date();
         this.updateDisplayAlerts();
      }
   }

   /**
    * Alert
    */
   public showAlert(alert: NgxModernAlert): void {
      alert.message = this.domSanitizer.bypassSecurityTrustHtml(alert.message as string);
      if (alert.svgIcon) {
         alert.svgIcon = this.domSanitizer.bypassSecurityTrustHtml(alert.svgIcon as string);
      }

      this.alerts.unshift(alert);
      this.updateDisplayAlerts();
   }

   /**
    * Update Display Alerts
    */
   private updateDisplayAlerts(): void {
      this.displayAlerts = this.alerts.filter((a) => {
         if (a.dismissedAt) {
            return false;
         } else if (a.validUntil && a.validUntil.getTime() > new Date().getTime()) {
            return false;
         }

         return true;
      });
      this.alertLayerComponentRef.instance.setDisplayAlerts(this.displayAlerts);
   }

   /**
    * Create Alert
    */
   private createAlert(message: string | HtmlString, level: NgxModernAlertLevel, displayType: NgxModernAlertOverlayType): void {
      const alert = new NgxModernAlert(message);
      alert.level = level;
      alert.overlayType = displayType;
      this.showAlert(alert);
   }

   /**
    * Alert Info
    */
   public info(message: string | HtmlString): void {
      this.createAlert(message, 'info', 'floating');
   }

   /**
    * Alert Banner Info
    */
   public infoBanner(message: string | HtmlString): void {
      this.createAlert(message, 'info', 'banner');
   }

   /**
    * Alert Success
    */
   public success(message: string | HtmlString): void {
      this.createAlert(message, 'success', 'floating');
   }

   /**
    * Alert Banner Success
    */
   public successBanner(message: string | HtmlString): void {
      this.createAlert(message, 'success', 'banner');
   }

   /**
    * Alert Warning
    */
   public warning(message: string | HtmlString): void {
      this.createAlert(message, 'warning', 'floating');
   }

   /**
    * Alert Banner Warning
    */
   public warningBanner(message: string | HtmlString): void {
      this.createAlert(message, 'warning', 'banner');
   }

   /**
    * Alert Danger
    */
   public danger(message: string | HtmlString): void {
      this.createAlert(message, 'danger', 'floating');
   }

   /**
    * Alert Banner Danger
    */
   public dangerBanner(message: string | HtmlString): void {
      this.createAlert(message, 'danger', 'banner');
   }
}
