import { SafeHtml } from '@angular/platform-browser';

export type NgxModernAlertLevel = 'info' | 'success' | 'warning' | 'danger';
export type NgxModernAlertOverlayType = 'banner' | 'floating';

export class NgxModernAlert {
   public id = Math.random().toString(36).slice(2, 7);
   public message?: string | SafeHtml;
   public notifiedAt: Date = new Date();
   public dismissedAt?: Date;
   public level?: NgxModernAlertLevel;
   public svgIcon?: string | SafeHtml;
   public validUntil?: Date;
   public overlayType?: NgxModernAlertOverlayType;

   constructor(message?: string | SafeHtml) {
      if (message) {
         this.message = message;
      }
   }
}
