import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BackTrackingService } from './core/back-tracking.service';
import { PegDirective } from './core/peg.directive';
import { BoardComponent } from './board/board.component';
import { ControlsComponent } from './controls/controls.component';



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
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
  ],
  providers: [ BackTrackingService ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
