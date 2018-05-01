import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

// ADDED
import { UserProvider } from '../../providers/user/user'

@Component({
  selector: 'page-home-registered',
  templateUrl: 'home-registered.html',
})
export class HomeRegisteredPage {
  public today: number

  constructor(public navCtrl: NavController, public userData: UserProvider, public zone: NgZone) {
    this.today = Date.now()
    // this.getUserStatus()
  }

  ionViewWillEnter() { // Runs when the page is about to enter
    this.today = Date.now()
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad HomeRegisteredPage')
  //   // this.getUserStatus()
  // }

  // getUserStatus() {
  //   this.zone.run(() => {
  //     if (!this.userData.hasToken) {
  //       this.userData.getUserAccount()
  //     }
  //   })
  // }
}
