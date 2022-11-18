import { animate, style, transition, trigger } from '@angular/animations';
import {
   ChangeDetectionStrategy,
   Component,
   ElementRef,
   EventEmitter,
   HostBinding,
   Input,
   OnChanges,
   OnInit,
   Output,
   SimpleChanges,
   ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxModernAlert, NgxModernAlertLevel, NgxModernAlertOverlayType } from '../../core/ngx-modern-alert';
import { NgxModernAlertIcons } from '../../core/ngx-modern-alert-icons';

@Component({
   selector: 'ngx-modern-alert',
   templateUrl: './ngx-modern-alert.component.html',
   styleUrls: ['./ngx-modern-alert.component.scss'],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush,
   animations: [
      trigger('animation', [
         transition('* => floating', [
            style({ transform: 'translateX(100%)' }),
            animate('250ms ease', style({ transform: 'translateX(0)' })),
         ]),
         transition('floating => *', [
            style({ transform: 'translateX(0)', opacity: 0.5 }),
            animate('250ms ease-in', style({ transform: 'translateX(120%)', opacity: 0 })),
         ]),

         transition('* => banner', [
            style({ transform: 'translateY(-100%)' }),
            animate('250ms ease', style({ transform: 'translateY(0)' })),
         ]),
         transition('banner => *', [
            style({ transform: 'translateY(0)', opacity: 0.5 }),
            animate('150ms ease', style({ transform: 'translateY(-20%)', opacity: 0 })),
         ]),
      ]),
   ],
})
export class NgxModernAlertComponent implements OnInit, OnChanges {
   @HostBinding('class')
   public class = 'ngx-modern-alert';

   @Input()
   public alert?: NgxModernAlert;

   @Input()
   public text?: string;

   @Input()
   public level?: NgxModernAlertLevel;

   @Input()
   public showCloseBtn = false;

   @Input()
   public hideIcon = false;

   @Output()
   public dismiss = new EventEmitter<boolean>();

   public iconPath: string | undefined;

   @HostBinding('@animation')
   public get getState(): NgxModernAlertOverlayType | undefined {
      return this.alert?.overlayType;
   }

   constructor(private domSanitizer: DomSanitizer, private elementRef: ElementRef) {}

   /**
    * TODO: dismissible, deletable, readable, notifyable, levelable
    */

   ngOnInit(): void {}

   ngOnChanges(changes: SimpleChanges): void {
      if (changes['alert'] && this.alert) {
         if (!this.alert.svgIcon && this.alert.level) {
            this.iconPath = NgxModernAlertIcons[this.alert.level];
         } else {
            this.iconPath = void 0;
         }
      }
      if (changes['text'] && this.text && !this.alert) {
         this.alert = new NgxModernAlert(this.domSanitizer.bypassSecurityTrustHtml(this.text));
         if (this.level) {
            this.iconPath = NgxModernAlertIcons[this.level];
         }
      }
   }

   /**
    * Dismiss
    */
   public onDismiss(): void {
      this.dismiss.emit(true);
   }
}
