import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   inject,
   Input,
   Output
} from '@angular/core';
import { NgxModernAlert } from '../../core/ngx-modern-alert';
import { NgxModernAlertIcons } from '../../core/ngx-modern-alert-icons';
import { SafeHtml } from '@angular/platform-browser';

@Component({
   selector: 'ngx-modern-alert-hub',
   templateUrl: './ngx-modern-alert-hub.component.html',
   styleUrls: ['./ngx-modern-alert-hub.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxModernAlertHubComponent {
   @Input()
   public alerts: NgxModernAlert[] = [];

   @Output()
   public dismiss: EventEmitter<NgxModernAlert> = new EventEmitter<NgxModernAlert>();

   @Output()
   public clearAll: EventEmitter<void> = new EventEmitter<void>();

   @Output()
   public close: EventEmitter<void> = new EventEmitter<void>();

   constructor(public cdRef: ChangeDetectorRef) {
   }

   public getIconPath(alert: NgxModernAlert): SafeHtml | undefined {
      return alert.level ? NgxModernAlertIcons[alert.level] : undefined;
   }

   public copyMessage(alert: NgxModernAlert, event: MouseEvent): void {
      event.stopPropagation();
      const message = (alert.message as any)?.changingThisBreaksApplicationSecurity || alert.message;
      if (typeof message === 'string') {
         const tempEl = document.createElement('div');
         tempEl.innerHTML = message;
         navigator.clipboard.writeText(tempEl.innerText || "");
      }
   }
}
