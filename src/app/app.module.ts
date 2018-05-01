import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

// ADDED
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
// To install Toast:
// https://ionicframework.com/docs/native/toast/
import { Toast } from '@ionic-native/toast';
// To check for Network
import { Network } from '@ionic-native/network';

// PAGES
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { HomeRegisteredPage } from '../pages/home-registered/home-registered';

import { AllUsersPage } from '../pages/all-users/all-users';
// ADDED
import { RegisterPage } from '../pages/register/register';
import { AccountPage } from '../pages/account/account';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// TABS
// import { TabsPage } from '../pages/tabs/tabs';
import { TabsUserPage } from '../pages/tabs-user/tabs-user';
import { TabsGuestPage } from '../pages/tabs-guest/tabs-guest';

// PROVIDER ADDED 
import { UserProvider } from '../providers/user/user';
import { ConnectionProvider } from '../providers/connection/connection';
import { ConfigProvider } from '../providers/config/config';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    HomeRegisteredPage,
    // TabsPage,
    TabsUserPage,
    TabsGuestPage,
    RegisterPage,
    AccountPage,
    AllUsersPage
  ],
  imports: [
    BrowserModule,
    // ADDED
    HttpClientModule,
    // IonicModule.forRoot(MyApp),
    // OR
    IonicModule.forRoot(MyApp, {
      /* Prevent hardware back button from closing the application 
       * [true = can close | false = cannot close]
       */
      navExitApp: false
    }),
    // ADDED
    IonicStorageModule.forRoot({
      name: '__myUserDB',
      // driverOrder: ['indexeddb', 'sqlite', 'websql']
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    HomeRegisteredPage,
    // TabsPage,
    TabsUserPage,
    TabsGuestPage,
    RegisterPage,
    AccountPage,
    AllUsersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // ADDED
    Toast,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    ConnectionProvider,
    ConfigProvider
  ]
})
export class AppModule {}
