import { Component, NgZone } from '@angular/core';
import { App, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { ConfigProvider } from '../providers/config/config'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsUserPage } from '../pages/tabs-user/tabs-user';
import { TabsGuestPage } from '../pages/tabs-guest/tabs-guest';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // No default page or it will be showned !!!
  // Initialize the rootPage to null at first, and then it will be initialized
  // with the right page when the promise is resolved.
  protected rootPage: any = null; // = TabsGuestPage;

  public hasToken: boolean;
  public name: string;
  public unique_token: string;

  public backButtonPressed: boolean = false;
  public backButtonPressedTimer: number;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage,
    zone: NgZone,
    appCtrl: App,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public network: Network,
    public config: ConfigProvider) {
    // public connection: ConnectionProvider) {
    platform.ready().then(() => {
      /**
       * Now check if we are already registered to select the right root page
       * from our 2 tabs Page available
       */
      zone.run(() => {
        storage
          .get('__user_account')
          .then((user) => {
            if (user != null) {
              this.hasToken = true
              this.name = user.name
              this.unique_token = user.unique_token
              this.rootPage = TabsUserPage
            } else {
              this.rootPage = TabsGuestPage
            }
          }
          )
      })

      /**
       * Registering Back device if it's not iOS
       * https://ionicframework.com/docs/api/platform/Platform/
       */
      if (!platform.is('ios')) {
        // https://www.gajotres.net/ionic-2-3-how-to-manage-hardware-back-button-event-like-a-pro/
        platform.registerBackButtonAction(() => {

          let nav = appCtrl.getActiveNavs()[0];
          let activeView = nav.getActive();

          // If current Home Page is from a user or a guest
          if (activeView.name === "HomePage" || activeView.name === "HomeRegisteredPage") {

            if (nav.canGoBack()) { //Can we go back?
              nav.pop();
            } else {
              const alert = this.alertCtrl.create({
                title: 'App termination',
                message: 'Do you want to quit?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      // console.log('Application exit prevented!');
                    }
                  },
                  {
                    text: 'Quit',
                    handler: () => {
                      platform.exitApp(); // Close this application
                    }
                  }
                ]
              });
              // Show the Alert Message
              alert.present();
            }
          }
        });
      } // End of iOS checking

      /**
       * Checking Network
       */
      this.network.onDisconnect().subscribe(() => {
        // this.networkStatus = false
        // this.connection.networkStatus = false
        this.config.networkStatus = false
        this.config.networkType = this.network.type
        this.presentToast(`You're disconnected from the network!`)
      })

      this.network.onConnect().subscribe(() => {
        // this.networkStatus = true
        // this.connection.networkStatus = true
        this.config.networkStatus = true
        this.config.networkType = this.network.type.toUpperCase()
        this.presentToast(`You're connected to the Network (${this.config.networkType})`)
      })

      // ****************************************
      // JUST A TEST TO CHECK IF WITHOUT IT WORKS
      // ****************************************
      //
      // if (this.network.type !== 'none') {
      //   return true
      // } else if (this.network.type === 'none') {
      //   this.presentToast('Please Check your network and try again')
      // } else {
      //   this.presentToast('Please Check your network and try again')
      // }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault()
      splashScreen.hide()
    }) // End of platform.ready()
  } // End of Constructor

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // Hold back twice to exit
  // See:
  // - https://stackoverflow.com/questions/43804798/ionic-2-prevent-exit-app-on-hardware-back-button
  // - https://stackoverflow.com/questions/40539573/ionic-2-cancel-hard-back-button-override-to-close-app-on-back-button-when-use

  // OR
  // From: https://forum.ionicframework.com/t/press-back-button-again-to-exit/4725/13
  // the following code
  // and see also: https://forum.ionicframework.com/t/how-to-hold-back-twice-to-exit/80544/15
  /*
  registerBackButtonAction() {
    this.platform.registerBackButtonAction((): any => {

      // if there is an alert
      let el: any = document.querySelector('ion-backdrop');
      if (el) {
        el.click();
        return;
      }

      // if there are tabs
      let page = this.navCtrl.getActive().instance;
      if (!(page instanceof TabsPage)) {
        if (!this.navCtrl.canGoBack()) {
          return this.showExit();
        }
        return this.navCtrl.pop();
      }
      let tabs = page.tabs;
      let activeNav = tabs.getSelected();
      if (!activeNav.canGoBack()) {

        // if not on a specific tab, nav to that tab
        if (activeNav.getActive().name !== 'PatientListPage') {
          return this.tabs.select(0);
        } else {
          return this.showExit();
        }
      }
      return activeNav.pop();

      // refer this priority number from this link:
      // http://www.gajotres.net/ionic-framework-handling-android-back-button-like-a-pro/
      // FOR IONIC VERSION 2/3:
      // https://www.gajotres.net/ionic-2-3-how-to-manage-hardware-back-button-event-like-a-pro/
    }, 101);
  }

  // exit toast
  showExit() {
    let toast = this.toastCtrl.create({
      message: 'Press again to exit App',
      position: 'bottom'
    });
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      toast.present();
      // this.toastCtrl.present('Press again to exit App');
      this.backButtonPressed = true;
      if (this.backButtonPressedTimer) {
        clearTimeout(this.backButtonPressedTimer);
      }
      this.backButtonPressedTimer = setTimeout(() => {
        this.backButtonPressed = false
      }, 2000);
    }
  }
  */
}
