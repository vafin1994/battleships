import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainContainerComponent} from './main-container/main-container.component';
import {AppRoutingModule} from './app-routing.module';
import {BattleshipsComponent} from './battleships/battleships.component';
import {SocketService} from './socket.service';
import {FormsModule} from '@angular/forms';
import {VugasiConnectionService} from './vugasi-connection.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GamesService} from './games.service';
import {MatButtonModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    BattleshipsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [SocketService, VugasiConnectionService, GamesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
