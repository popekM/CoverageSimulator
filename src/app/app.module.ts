import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { ServiceService } from './service.service';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    VisualisationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
