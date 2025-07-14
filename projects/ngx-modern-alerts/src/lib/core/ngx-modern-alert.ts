import { SafeHtml } from '@angular/platform-browser';
import { AlertActionTypeEnum, AlertLevelEnum, AlertOverlayTypeEnum } from './ngx-modern-alert-enums';

export interface NgxModernAlertAction {
   type: AlertActionTypeEnum;
   label: string;
   feedback?: string; // e.g., "Copied!"
   onClick: (alert: NgxModernAlert) => void;
}

export class NgxModernAlert {
   public id: string = Math.random().toString(36).slice(2, 9);
   public message?: string | SafeHtml;
   public notifiedAt: Date = new Date();
   public dismissedAt?: Date;
   public timedOut?: boolean;
   public dismissFromHubOnTimeout?: boolean;
   public level?: AlertLevelEnum;
   public svgIcon?: string | SafeHtml;
   public overlayType?: AlertOverlayTypeEnum;
   public validUntil?: Date;

   // New Properties
   public timeout?: number; // Duration in ms
   public disableTimeout?: boolean;
   public timeoutId?: number;
   public actions?: NgxModernAlertAction[];
   public feedbackText?: string | null = null;
   public showCopyButton: boolean = false;

   constructor(message?: string | SafeHtml) {
      if (message) {
         this.message = message;
      }
   }
}
