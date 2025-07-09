import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NgxModernAlertLayerComponent } from '../components/ngx-modern-alert-layer/ngx-modern-alert-layer.component';
import { NgxModernAlert } from '../core/ngx-modern-alert';
import { AlertLevelEnum, AlertOverlayTypeEnum } from '../core/ngx-modern-alert-enums';
import { NgxModernAlertHubComponent } from '../components/ngx-modern-alert-hub/ngx-modern-alert-hub.component';

type HtmlString = string;

@Injectable({
   providedIn: 'root',
})
export class NgxModernAlertService implements OnDestroy {
   private subscriptions: Subscription[] = [];
   private alerts: NgxModernAlert[] = [];
   private displayAlerts: NgxModernAlert[] = [];
   private readonly STORAGE_KEY: string = 'ngx-modern-alerts-history';

   private hubVisible = new BehaviorSubject<boolean>(false);
   public hubVisible$ = this.hubVisible.asObservable();

   private alertFilter = new BehaviorSubject<AlertLevelEnum[] | null>(null);

   public maxMessages: number = 5;
   public timeoutMs: number = 5000;
   public xPosition: 'right' | 'left' = 'right';
   public yPosition: 'top' | 'bottom' = 'top';
   public xOffset: string = '0';
   public yOffset: string = '0';

   private alertOverlayRef?: OverlayRef;
   private alertLayerComponentRef?: ComponentRef<NgxModernAlertLayerComponent>;
   private hubOverlayRef?: OverlayRef;
   private hubComponentRef?: ComponentRef<NgxModernAlertHubComponent>;

   constructor(private overlay: Overlay, private domSanitizer: DomSanitizer) {
      this._loadAlerts();
   }

   public ngOnDestroy(): void {
      this.subscriptions.forEach((s) => s.unsubscribe());
      this.destroyPortal();
   }

   public toggleHub(visible?: boolean): void {
      const isVisible = visible ?? !this.hubVisible.value;
      if (isVisible) {
         this._createHubPortal();
      } else {
         this._destroyHubPortal();
      }
      this.hubVisible.next(isVisible);
   }

   private _createHubPortal(): void {
      if (this.hubOverlayRef) {
         return;
      }
      this.hubOverlayRef = this.overlay.create({
         hasBackdrop: true,
         backdropClass: 'ngx-modern-alerts-hub-backdrop',
         positionStrategy: this.overlay.position().global().right('0').top('0'),
         scrollStrategy: this.overlay.scrollStrategies.block(),
      });

      const portal = new ComponentPortal(NgxModernAlertHubComponent);
      this.hubComponentRef = this.hubOverlayRef.attach(portal);
      this.hubComponentRef.instance.alerts = this.alerts.filter(a => !a.dismissedAt);

      this.hubOverlayRef.backdropClick().subscribe(() => this.toggleHub(false));

      this.subscriptions.push(
         this.hubComponentRef.instance.dismiss.subscribe(alert => this.dismissAlert(alert)),
         this.hubComponentRef.instance.clearAll.subscribe(() => this.clearAll()),
         this.hubComponentRef.instance.closed.subscribe(() => this.toggleHub(false))
      );
   }

   private _destroyHubPortal(): void {
      if (this.hubOverlayRef) {
         this.hubOverlayRef.dispose();
         this.hubOverlayRef = undefined;
         this.hubComponentRef = undefined;
      }
   }

   public setFilter(levels: AlertLevelEnum[]): void {
      this.alertFilter.next(levels);
      this.updateDisplayAlerts();
   }

   public clearFilter(): void {
      this.alertFilter.next(null);
      this.updateDisplayAlerts();
   }

   private createPortal(): void {
      if (this.alertOverlayRef) {
         return;
      }
      this.alertOverlayRef = this.overlay.create({
         panelClass: 'ngx-modern-alert-layer-panel',
      });

      const componentPortal = new ComponentPortal(NgxModernAlertLayerComponent);
      this.alertLayerComponentRef = this.alertOverlayRef.attach(componentPortal);

      const style = this.alertOverlayRef.overlayElement.style;
      style[this.xPosition] = this.xOffset;
      style[this.yPosition] = this.yOffset;

      this.subscriptions.push(
         this.alertLayerComponentRef.instance.dismissAlert$.subscribe((alert) => {
            this.dismissAlert(alert);
         })
      );
   }

   private destroyPortal(): void {
      if (this.alertLayerComponentRef) {
         this.alertLayerComponentRef.destroy();
         this.alertLayerComponentRef = undefined;
      }
      if (this.alertOverlayRef) {
         this.alertOverlayRef.detach();
         this.alertOverlayRef = undefined;
      }
   }

   public dismissAlert(alert: NgxModernAlert): void {
      const alertRef = this.alerts.find((a) => a.id === alert.id);
      if (!alertRef) {
         return;
      }

      // The component sets the timedOut flag just before calling dismiss.
      if (alert.timedOut && !alertRef.dismissFromHubOnTimeout) {
         // This was a timeout and the alert should remain in the hub.
         // We mark it as `timedOut` to filter it from the main display layer, but since
         // `dismissedAt` is not set, it will remain in the hub's list.
         alertRef.timedOut = true;
      } else {
         // This is a manual dismissal, or a timeout that should also clear from the hub.
         alertRef.dismissedAt = new Date();
      }

      if (alertRef.timeoutId) {
         clearTimeout(alertRef.timeoutId);
      }

      this.updateDisplayAlerts();
      this._saveAlerts();
   }

   public clearAll(): void {
      this.alerts.forEach(alert => {
         if (alert.timeoutId) {
            clearTimeout(alert.timeoutId);
         }
         alert.dismissedAt = new Date();
      });
      this.updateDisplayAlerts();
      this._saveAlerts();
   }

   public showAlert(alert: NgxModernAlert): void {
      if (typeof alert.message === 'string') {
         alert.message = this.domSanitizer.bypassSecurityTrustHtml(alert.message);
      }
      if (typeof alert.svgIcon === 'string') {
         alert.svgIcon = this.domSanitizer.bypassSecurityTrustHtml(alert.svgIcon);
      }

      // Set showCopyButton to true for all service-generated alerts, if not set otherwise.
      if (alert.showCopyButton === undefined) {
         alert.showCopyButton = true;
      }

      this.alerts.unshift(alert);
      this._saveAlerts();
      this.updateDisplayAlerts();
   }

   private updateDisplayAlerts(): void {
      const now = new Date().getTime();
      const activeAlerts = this.alerts.filter((a) => !a.dismissedAt && !a.timedOut && !(a.validUntil && a.validUntil.getTime() < now));

      const currentFilter = this.alertFilter.getValue();
      const filteredAlerts = currentFilter
         ? activeAlerts.filter((a) => a.level && currentFilter.includes(a.level))
         : activeAlerts;

      this.displayAlerts = filteredAlerts.slice(0, this.maxMessages);

      // Update alert layer if it exists
      if (this.displayAlerts.length > 0) {
         if (!this.alertOverlayRef) {
            this.createPortal();
         }
         this.alertLayerComponentRef?.instance.setDisplayAlerts(this.displayAlerts);
      } else {
         // When the last alert is dismissed, the layer must be explicitly updated with an
         // empty array to ensure the final alert is removed from the DOM.
         this.alertLayerComponentRef?.instance.setDisplayAlerts([]);
         if (!this.hubVisible.value) {
            this.destroyPortal();
         }
      }

      // Update hub component if it exists, ensuring it's always up-to-date
      if (this.hubComponentRef) {
         this.hubComponentRef.instance.alerts = this.alerts.filter(a => !a.dismissedAt);
         this.hubComponentRef.instance.cdRef.markForCheck();
      }
   }

   private createAlert(message: string | HtmlString, level: AlertLevelEnum, displayType: AlertOverlayTypeEnum, timeout?: number): void {
      const alert = new NgxModernAlert(message);
      alert.level = level;
      alert.overlayType = displayType;
      if (timeout) {
         alert.timeout = timeout;
      } else if (displayType === AlertOverlayTypeEnum.Floating) {
         alert.timeout = this.timeoutMs;
      }
      this.showAlert(alert);
   }

   private _saveAlerts(): void {
      try {
         const storableAlerts = this.alerts.slice(0, 50).map(alert => {
            const copy: Partial<NgxModernAlert> = { ...alert };
            delete copy.timeoutId; // Cannot be serialized

            // Unwrap SafeHtml to a primitive string for serialization
            if (copy.message && typeof copy.message !== 'string') {
               copy.message = (copy.message as any).changingThisBreaksApplicationSecurity || '';
            }
            if (copy.svgIcon && typeof copy.svgIcon !== 'string') {
               copy.svgIcon = (copy.svgIcon as any).changingThisBreaksApplicationSecurity || '';
            }

            return copy;
         });
         localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storableAlerts));
      } catch (e) {
         console.error('Could not save alerts to local storage.', e);
      }
   }

   private _loadAlerts(): void {
      try {
         const storedAlerts = localStorage.getItem(this.STORAGE_KEY);
         if (storedAlerts) {
            this.alerts = JSON.parse(storedAlerts).map((a: any) => {
               const alert = new NgxModernAlert();
               Object.assign(alert, a);

               // Re-sanitize HTML strings after loading from storage
               if (alert.message) {
                  alert.message = this.domSanitizer.bypassSecurityTrustHtml(alert.message as string);
               }
               if (alert.svgIcon) {
                  alert.svgIcon = this.domSanitizer.bypassSecurityTrustHtml(alert.svgIcon as string);
               }

               // Dates need to be reconstructed
               if (a.notifiedAt) alert.notifiedAt = new Date(a.notifiedAt);
               if (a.dismissedAt) alert.dismissedAt = new Date(a.dismissedAt);
               if (a.validUntil) alert.validUntil = new Date(a.validUntil);
               return alert;
            });
            this.updateDisplayAlerts();
         }
      } catch(e) {
         console.error('Could not load alerts from local storage.', e);
         this.alerts = [];
      }
   }

   public info(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Info, AlertOverlayTypeEnum.Floating, timeout);
   }

   public infoBanner(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Info, AlertOverlayTypeEnum.Banner, timeout);
   }

   public success(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Success, AlertOverlayTypeEnum.Floating, timeout);
   }

   public successBanner(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Success, AlertOverlayTypeEnum.Banner, timeout);
   }

   public warning(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Warning, AlertOverlayTypeEnum.Floating, timeout);
   }

   public warningBanner(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Warning, AlertOverlayTypeEnum.Banner, timeout);
   }

   public danger(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Danger, AlertOverlayTypeEnum.Floating, timeout);
   }

   public dangerBanner(message: string | HtmlString, timeout?: number): void {
      this.createAlert(message, AlertLevelEnum.Danger, AlertOverlayTypeEnum.Banner, timeout);
   }
}
