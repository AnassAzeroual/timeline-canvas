import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgIf } from '@angular/common';
import { CustomVideoTimelineComponent } from './custom-video-timeline/custom-video-timeline.component';
import { SecondsToHoursPipe } from './seconds-to-hours.pipe';

@NgModule({
  declarations: [	
    AppComponent,
    SecondsToHoursPipe
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIf,CustomVideoTimelineComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
