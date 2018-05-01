import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

// ADDED
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

import { UserProvider } from '../../providers/user/user';

// Used to go back to this page when we delete the account
// So we also need to import App controller from ionic-angular
import { TabsGuestPage } from '../tabs-guest/tabs-guest';

// The URL of the remote server
// const URL = 'http://localhost:8000/api/user_request';
const URL = 'http://test.sotfall.com/api/user_request';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  /**
   * Injection Dependencies
   */
  constructor (
    public appCtrl: App,
    public navCtrl: NavController,
    public http: HttpClient,
    public userData: UserProvider,
    private storage: Storage ) {}

  /**
   * Before showing the view and change it when he
   * check the token user, it's better to use the
   * function onViewDidEnter() so the view will
   * be updated before showing it.
   * 
   * Doc: https://ionicframework.com/docs/api/navigation/NavController/
   * 
   */
  onViewDidEnter () {
    // Check if we already have a registered user
    if (!this.userData.hasToken) {
      this.userData.getUserAccount();
    }
  }

  /**
   * We delete our account in the remote server
   * and we delete our token in the smartphone
   */
  doDeleteUser() {
    this.http
      .delete(URL + '?unique_token=' + this.userData.unique_token)
      .subscribe(
        success => {
          console.log("Token ID: " + this.userData.unique_token + " " + success['message']);
        },
        error => {
          console.log("Error #" + error.status + " (" + error.error.message + ")");
        }
      );

    this.storage.remove('__user_account');
    this.userData.hasToken = false;
    this.userData.name = "";
    this.userData.unique_token = "";

    // Go to home Tab (tab index 0)
    // this.navCtrl.parent.select(0);
    //this.appCtrl.getRootNav().setRoot(TabsGuestPage);

    // Change because of the message from ionic:
    // (getRootNav) is deprecated and will be removed in the next major release. 
    // Use getRootNavById instead.
    this.appCtrl.getRootNavs()[0].setRoot(TabsGuestPage);
  }
}
