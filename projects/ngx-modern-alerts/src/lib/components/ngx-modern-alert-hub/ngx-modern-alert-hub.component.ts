import { formatDate } from '@angular/common';
import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   Inject,
   Input,
   LOCALE_ID,
   Output,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NgxModernAlert } from '../../core/ngx-modern-alert';
import { NgxModernAlertIcons } from '../../core/ngx-modern-alert-icons';

@Component({
   selector: 'ngx-modern-alert-hub',
   templateUrl: './ngx-modern-alert-hub.component.html',
   styleUrls: ['./ngx-modern-alert-hub.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxModernAlertHubComponent {
   @Input()
   public alerts: NgxModernAlert[] = [];

   @Input()
   public timeFormat: string = 'HH:mm';

   @Output()
   public dismiss: EventEmitter<NgxModernAlert> = new EventEmitter<NgxModernAlert>();

   @Output()
   public clearAll: EventEmitter<void> = new EventEmitter<void>();

   @Output()
   public closed: EventEmitter<void> = new EventEmitter<void>();

   constructor(
      public cdRef: ChangeDetectorRef,
      @Inject(LOCALE_ID) private locale: string
   ) {}

   public getIconPath(alert: NgxModernAlert): string | undefined {
      return alert.level ? NgxModernAlertIcons[alert.level] : undefined;
   }

   public copyMessage(alert: NgxModernAlert, event: MouseEvent): void {
      event.stopPropagation();
      const message = (alert.message as any)?.changingThisBreaksApplicationSecurity || alert.message;
      if (typeof message === 'string') {
         const tempEl = document.createElement('div');
         tempEl.innerHTML = message;
         navigator.clipboard.writeText(tempEl.innerText || '');
      }
   }

   public formatDate(dateInput: Date | string): string {
      const alertDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const notificationDate = new Date(alertDate.getFullYear(), alertDate.getMonth(), alertDate.getDate());

      if (today.getTime() === notificationDate.getTime()) {
         return formatDate(alertDate, this.timeFormat, this.locale);
      }

      if (yesterday.getTime() === notificationDate.getTime()) {
         return 'Yesterday';
      }

      return formatDate(alertDate, 'MMM d', this.locale);
   }
}
