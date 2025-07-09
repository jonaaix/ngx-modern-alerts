# ngx-modern-alerts

[![npm](https://img.shields.io/npm/v/ngx-modern-alerts.svg)](https://www.npmjs.com/package/ngx-modern-alerts)
[![npm](https://img.shields.io/npm/dm/ngx-modern-alerts.svg)](https://www.npmjs.com/package/ngx-modern-alerts)
[![npm](https://img.shields.io/librariesio/release/npm/ngx-modern-alerts)](https://www.npmjs.com/package/ngx-modern-alerts)

### Advanced, modern, and customizable alerts for Angular

This library provides a flexible system for displaying banner and floating alerts (notifications), complete with a notification hub, timeouts, custom actions, and more.

### <a href="https://jonaaix.github.io/ngx-modern-alerts/" target="_blank">⇨ DEMO</a>

---

## Installation

```sh
# Install the Angular component
npm i -S ngx-modern-alerts
```

Import the NgxModernAlertModule and BrowserAnimationsModule into your AppModule.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxModernAlertModule } from 'ngx-modern-alerts';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxModernAlertModule
    ],
    // ...
})
export class AppModule {}
```


## Features
- Display banner or floating style alerts.
- A Notification Hub to view a history of recent alerts.
- Optional self-dismissing timeouts with a visual countdown.
- Support for custom action buttons inside alerts.
- Filter displayed alerts by level (e.g., show only errors).
- Easy to use via the NgxModernAlertService.
- Highly customizable via CSS variables.


## Usage
### 1. Using the Service
Inject NgxModernAlertService to create alerts from anywhere in your application.

```ts
import { Component } from '@angular/core';
import { NgxModernAlertService, NgxModernAlert, AlertLevelEnum, AlertActionTypeEnum } from 'ngx-modern-alerts';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showSuccess()">Show Success</button>
    <button (click)="showErrorWithTimeout()">Show Error (5s)</button>
    <button (click)="showAlertWithActions()">Show Alert with Actions</button>
    <button (click)="toggleHub()">Toggle Notification Hub</button>
  `
})
export class ExampleComponent {
    constructor(private alertService: NgxModernAlertService) {}

    showSuccess(): void {
        this.alertService.success('Your changes have been saved successfully!');
    }

    showErrorWithTimeout(): void {
        // This floating alert will disappear after 5 seconds
        this.alertService.danger('Could not connect to the server.', 5000);
    }

    showAlertWithActions(): void {
      const alert = new NgxModernAlert('A critical error occurred.');
      alert.level = AlertLevelEnum.Danger;
      alert.timeout = 15000;
      alert.actions = [
          {
              type: AlertActionTypeEnum.Custom,
              label: 'Report',
              feedback: 'Report sent!',
              onClick: (a) => console.log('Reporting alert:', a.id)
          }
      ];
      this.alertService.showAlert(alert);
    }

    toggleHub(): void {
        this.alertService.toggleHub();
    }
}
```

### 2. Using the Component
You can also render the component directly in your templates for static messages.

```html
<ngx-modern-alert text="This is a static information message." level="info"></ngx-modern-alert>

<ngx-modern-alert level="warning">
   <h3>Attention!</h3>
   <p>Please review your settings before proceeding.</p>
</ngx-modern-alert>

<ngx-modern-alert [text]="myText" level="danger" (dismiss)="onDismissed()"></ngx-modern-alert>
```


## Styling
You can easily override the default colors to match your application's theme, including dark mode.

```scss
/* In your global styles.scss */

/* Default (Light Mode) Variables */
:root {
    --ngx-modern-alert-bg-default: rgb(255 255 255 / 80%);
    --ngx-modern-alert-text-default: rgb(30 30 30);
    --ngx-modern-alert-info-color-icon: #2196f3;
    // ... etc.
}

/* Dark Mode Overrides */
body.dark {
    .ngx-modern-alert-container {
      --ngx-modern-alert-bg-default: rgb(30 30 30 / 85%);
      --ngx-modern-alert-text-default: rgb(200 200 200);
      --ngx-modern-alert-info-color-text: hsl(220, 50%, 65%);
      // ... etc.
    }
    .ngx-modern-alert-hub-container {
        background: rgba(40, 40, 40, 0.9);
        color: #eee;
        border-left-color: #555;
    }
}
```

