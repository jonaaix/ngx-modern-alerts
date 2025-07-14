import { Component, OnDestroy } from '@angular/core';
import { NgxModernAlert } from '../../projects/ngx-modern-alerts/src/lib/core/ngx-modern-alert';
import {
   AlertActionTypeEnum,
   AlertLevelEnum,
   AlertOverlayTypeEnum,
} from '../../projects/ngx-modern-alerts/src/lib/core/ngx-modern-alert-enums';
import { NgxModernAlertService } from '../../projects/ngx-modern-alerts/src/lib/services/ngx-modern-alert.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
   public text: string = `<i>Lorem ipsum dolor sit amet, consetetur sadipscing elitr</i>, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        <b>At vero eos et accusam et justo duo dolores et ea rebum.</b>
        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

   constructor(private alertService: NgxModernAlertService) {}

   public ngOnDestroy(): void {
      this.alertService.clearFilter();
   }

   public addBannerAlert(): void {
      this.alertService.infoBanner(this.text);
   }

   public addFloatingAlert(): void {
      this.alertService.success(this.text);
   }

   public addFloatingAlertWithTimeout(): void {
      this.alertService.warning('This message will disappear in 3 seconds.', 3000);
   }

   public addAlertWithActions(): void {
      const alert = new NgxModernAlert('This is a critical error. Please copy the details or report it.');
      alert.level = AlertLevelEnum.Danger;
      alert.overlayType = AlertOverlayTypeEnum.Floating;
      alert.timeout = 150000;
      alert.actions = [
         {
            type: AlertActionTypeEnum.Custom,
            label: 'Report',
            feedback: 'Report sent!',
            onClick: (a) => {
               console.log('Reporting alert:', a.id);
            },
         }
      ];
      alert.showCopyButton = true;
      this.alertService.showAlert(alert);
   }

   public toggleHub(): void {
      this.alertService.toggleHub();
   }

   public filterErrorsOnly(): void {
      this.alertService.setFilter([AlertLevelEnum.Danger]);
   }

   public clearFilter(): void {
      this.alertService.clearFilter();
   }

   public onDismissed(): void {
      console.warn('Alert dismissed from component output!');
   }
}
