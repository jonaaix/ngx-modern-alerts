import { animate, style, transition, trigger } from '@angular/animations';
import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   ElementRef,
   EventEmitter,
   HostBinding,
   HostListener,
   Input,
   OnChanges,
   OnDestroy,
   OnInit,
   Output,
   SimpleChanges,
   ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxModernAlert, NgxModernAlertAction } from '../../core/ngx-modern-alert';
import { AlertLevelEnum, AlertOverlayTypeEnum } from '../../core/ngx-modern-alert-enums';
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
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('250ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
         ]),
         transition('floating => *', [
            style({ transform: 'translateX(0)', opacity: 1 }),
            animate('250ms ease-in', style({ transform: 'translateX(120%)', opacity: 0 })),
         ]),
         transition('* => banner', [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('250ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
         ]),
         transition('banner => *', [
            style({ transform: 'translateY(0)', opacity: 1 }),
            animate('150ms ease-in', style({ transform: 'translateY(-20%)', opacity: 0 })),
         ]),
      ]),
   ],
})
export class NgxModernAlertComponent implements OnInit, OnChanges, OnDestroy {
   @HostBinding('class')
   public class: string = 'ngx-modern-alert';

   @Input()
   public alert?: NgxModernAlert;

   @Input()
   public text?: string;

   @Input()
   public level?: AlertLevelEnum | string;

   @Input()
   public elevated: boolean = false;

   @Input()
   public showCloseBtn: boolean = false;

   @Input()
   public hideIcon: boolean = false;

   @Input()
   public showCopyButton: boolean = false;

   @Output()
   public dismiss: EventEmitter<boolean> = new EventEmitter<boolean>();

   public iconPath: SafeHtml | undefined;
   public isHovered: boolean = false;
   public countdownProgress: number = 100;
   public countdownDisplayNumber: number = 0;

   private dismissIntervalId?: number;

   public readonly Math = Math;

   @HostBinding('@animation')
   public get getState(): AlertOverlayTypeEnum | undefined {
      return this.alert?.overlayType;
   }

   @HostListener('mouseenter')
   public onMouseEnter(): void {
      this.isHovered = true;
      this.cdRef.markForCheck();
   }

   @HostListener('mouseleave')
   public onMouseLeave(): void {
      this.isHovered = false;
      this.cdRef.markForCheck();
   }

   constructor(
      private domSanitizer: DomSanitizer,
      private elementRef: ElementRef,
      private cdRef: ChangeDetectorRef
   ) {}

   public ngOnInit(): void {
      this.setupAlert();
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes['alert'] || changes['text'] || changes['level']) {
         this.setupAlert();
      }
   }

   public ngOnDestroy(): void {
      clearInterval(this.dismissIntervalId);
   }

   private setupAlert(): void {
      clearInterval(this.dismissIntervalId);

      if (!this.alert) {
         this.alert = new NgxModernAlert(this.text ? this.domSanitizer.bypassSecurityTrustHtml(this.text) : '');
      }

      if (this.level) {
         this.alert.level = this.level as AlertLevelEnum;
      }

      this.showCopyButton = this.alert.showCopyButton || this.showCopyButton;

      if (!this.alert.svgIcon && this.alert.level) {
         this.iconPath = NgxModernAlertIcons[this.alert.level];
      } else {
         this.iconPath = undefined;
      }

      if (this.alert.timeout && this.alert.timeout > 0) {
         const startTime = Date.now();
         const totalDuration = this.alert.timeout;
         this.countdownDisplayNumber = Math.ceil(totalDuration / 1000);

         this.dismissIntervalId = window.setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, totalDuration - elapsedTime);

            this.countdownProgress = (remainingTime / totalDuration) * 100;
            this.countdownDisplayNumber = Math.ceil(remainingTime / 1000);

            if (remainingTime <= 0) {
               this.onDismiss();
            }
            this.cdRef.markForCheck();
         }, 50);
      }
   }

   public onDismiss(): void {
      clearInterval(this.dismissIntervalId);
      this.dismiss.emit(true);
   }

   public executeAction(action: NgxModernAlertAction, event: MouseEvent): void {
      event.stopPropagation();
      action.onClick(this.alert!);
      if (action.feedback && this.alert) {
         this.alert.feedbackText = action.feedback;
         this.cdRef.markForCheck();
         setTimeout(() => {
            if (this.alert) {
               this.alert.feedbackText = null;
               this.cdRef.markForCheck();
            }
         }, 2000);
      }
   }

   public copyMessage(event: MouseEvent): void {
      event.stopPropagation();
      if (this.alert) {
         const message = this.elementRef.nativeElement.querySelector('.ngx-modern-alert-message')?.innerText;
         if (message) {
            navigator.clipboard.writeText(message);
            this.alert.feedbackText = 'Copied!';
            this.cdRef.markForCheck();
            setTimeout(() => {
               if (this.alert) {
                  this.alert.feedbackText = null;
                  this.cdRef.markForCheck();
               }
            }, 2000);
         }
      }
   }
}
