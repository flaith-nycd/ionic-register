import { Component } from '@angular/core';
// ADDED ToastController
// import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
// import { NavController, ToastController } from 'ionic-angular';
import { App, NavController, ToastController } from 'ionic-angular';

// ADDED
import { Storage } from '@ionic/storage';
// import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { UserProvider } from '../../providers/user/user';

// After registration, we go to the home page
// import { HomePage } from '../home/home';
import { TabsUserPage } from '../tabs-user/tabs-user';

// The URL of the remote server
// const URL = 'http://localhost:8000/api/user_request';
const URL = 'http://test.sotfall.com/api/user_request';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  // User's array saved from the view
  viewUser = {
    name: '',
    email: '',
    password: '',
    // Just to display information
    response: ''
  };

  /**
   * Injection Dependencies
   */
  constructor (
    public appCtrl: App,
    public navCtrl: NavController,
    public http: HttpClient,
    public toastCtrl: ToastController,
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
   * From stackoverflow: https://stackoverflow.com/a/46417231/6765082
   * constructor      run first when the page is initiated.
   *                  Here is the best place to declare default value for your variable.
   * ionViewDidLoad   is fired when the view is completely loaded. 
   *                  It means you can attach doom element here.
   * ionViewWillEnter runs when the page is about to enter and become the active page.
   * ionViewDidEnter  runs when the page has fully entered and is now the active page.
   * 
   * Never put heavy synchronous code into ionViewWillEnter. 
   * Just use asynchronous in ionViewWillEnter and move all synchronous code to ionViewDidEnter.
   * Because in there, your page is entered and it will make a better UX.
   */
  onViewDidEnter () {
    // Check if we already have a registered user
    if (!this.userData.hasToken) {
      this.userData.getUserAccount();
    }
  }

  /** 
   * Just a little notification
   */
  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Receiving token ID from the server',
      position: 'top', //'middle',
      duration: 2000
    });
    toast.present();
  }

  /**
   * Register a new user
   * 
   * Get value from the view and send them to the remote server
   * whom will generate a token and send it back to be saved in the samrtphone
   */
  doRegister() {
    // Get data from our view and save in an object
    var userDataToSave = 
      {
        name: this.viewUser.name,
        email: this.viewUser.email,
        password: this.viewUser.password
      };

    // Now post the data to the remote server
    this.http
      .post(URL, userDataToSave)
      .subscribe(
        data => {
          // Show a temporary notification
          this.showToast();

          // Save global user information
          this.userData.hasToken = true;
          this.userData.unique_token = data['unique_token'];
          this.userData.name = this.viewUser.name;

          // Set the view
          this.viewUser.response = "Your token ID:  " + this.userData.unique_token;

          // Store an object of user's account
          this.storage.set('__user_account', {
            'name': this.viewUser.name,
            'unique_token': this.userData.unique_token
          });

          // Go to home Tab (tab index 0)
          // this.navCtrl.parent.select(0);
          
          // Set the root page to UserPage and load it
          // this.appCtrl.getRootNav().setRoot(TabsUserPage)
          
          // Change because of the message from ionic:
          // (getRootNav) is deprecated and will be removed in the next major release. 
          // Use getRootNavById instead.
          this.appCtrl.getRootNavs()[0].setRoot(TabsUserPage)

          // If you want to select a tab don’t use the navctrl
          // See here: https://forum.ionicframework.com/t/push-page-and-select-another-tab/70884/2
        }, 
        error => {
          this.userData.hasToken = false;

          // Set the view
          this.viewUser.response = "Error #" + error.status + " (" + error.error.message + ")";
        }
      );
  }
}
