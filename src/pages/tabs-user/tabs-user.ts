import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomeRegisteredPage } from '../home-registered/home-registered';
import { AccountPage } from '../account/account';
import { AllUsersPage } from '../all-users/all-users';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';

// ADDED
//import { UserProvider } from '../../providers/user/user';
//import { ConnectionProvider } from '../../providers/connection/connection';

@IonicPage()
@Component({
  selector: 'page-tabs-user',
  templateUrl: 'tabs-user.html',
})
export class TabsUserPage {

  tab1Root = HomeRegisteredPage;
  tab2Root = AccountPage;
  tab3Root = AllUsersPage;
  tab4Root = ContactPage;
  tab5Root = AboutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TabsUserPage');
  }

}
