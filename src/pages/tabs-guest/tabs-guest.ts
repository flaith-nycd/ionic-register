import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { AboutPage } from '../about/about';

@IonicPage()
@Component({
  selector: 'page-tabs-guest',
  templateUrl: 'tabs-guest.html',
})
export class TabsGuestPage {

  tab1Root = HomePage;
  tab2Root = RegisterPage;
  tab3Root = AboutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TabsGuestPage');
  }

}
