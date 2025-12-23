import { DomSanitizer, bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgModule, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

bootstrapApplication(AppComponent, {
  providers:[importProvidersFrom(HttpClientModule), provideAnimationsAsync()]
})
  .catch((err) => console.error(err));

  

