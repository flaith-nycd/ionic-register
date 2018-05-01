// import { Component, OnInit } from '@angular/core'
import { Component, NgZone } from '@angular/core'
import { NavController } from 'ionic-angular'

// ADDED
import { UserProvider } from '../../providers/user/user'

// const MAX_TIME = 10

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public today: number

  // Timer test
  // public timeLeft: number
  // public timer: number

  // Dependency Injection setup
  constructor(public navCtrl: NavController, public userData: UserProvider, public zone: NgZone) {
    console.log('constructor ()')

    this.today = Date.now()
    // this.getUserStatus()
  }
  
  // https://blog.ionicframework.com/navigating-lifecycle-events/
  ionViewWillEnter () { // Runs when the page is about to enter
    this.today = Date.now()
    // console.log('ionViewWillEnter HomePage')
    // this.getUserStatus()
  }

  // onViewDidLoad  () {  // Fired only when a view is stored in memory
  // ionViewDidEnter () {  // Runs when the page is totally loaded
  //   console.log('ionViewDidEnter()')
  //   // No need to launch the timer if we already launched it
  //   // if (this.timeLeft != 0) {
  //   //   this.launchTimer()
  //   // }
  // }

  // ionViewDidLeave (){
  //   console.log('ionViewDidLeave HomePage')
  // }

  // Get The user status
  // Using NgZone
  // getUserStatus () {
  //   this.zone.run(() => {
  //     if (!this.userData.hasToken) {
  //       this.userData.getUserAccount()
  //     }
  //   })
  // }

}
