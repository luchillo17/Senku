import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatListModule,
  MatSelectModule,
  MatSnackBarModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BoardComponent } from './board';
import { ControlsComponent } from './controls';
import { BackTrackingService, PegDirective } from './core';


// Application module, here we configure the app deps
@NgModule({
  declarations: [
    AppComponent,
    PegDirective,
    BoardComponent,
    ControlsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatFormFieldModule,
  ],
  providers: [ BackTrackingService ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
