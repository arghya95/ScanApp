import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BLE } from '@ionic-native/ble';
import * as firebase from 'firebase';
import { Push } from '@ionic-native/push';

 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyC7mP7AFDh_er3FIt9nOUmb7ercrFqjDXU",
  authDomain: "devicefinder-197311.firebaseapp.com",
  databaseURL: "https://devicefinder-197311.firebaseio.com",
  projectId: "devicefinder-197311",
  storageBucket: "devicefinder-197311.appspot.com",
  messagingSenderId: "515334193474"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
