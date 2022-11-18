import { Component } from '@angular/core';
import { NgxModernAlertService } from '../../projects/ngx-modern-alerts/src/lib/services/ngx-modern-alert.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent {
   public text = `<i>Lorem ipsum dolor sit amet, consetetur sadipscing elitr</i>, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        <b>At vero eos et accusam et justo duo dolores et ea rebum.</b>
        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

   public text2 = `<img src="https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
   width="200px" style="float: right; margin-left: 6px; border-radius: 4px;   box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);">
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
<b>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</b>
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

   constructor(private alertService: NgxModernAlertService) {}

   /**
    * Add Dummy Alert
    */
   public addBannerAlert(): void {
      this.alertService.infoBanner(this.text);
   }

   /**
    * Add Floating Alert
    */
   public addFloatingAlert(): void {
      this.alertService.info(this.text);
   }

   public onDismissed(): void {
      console.warn('Alert dismissed!');
   }
}
