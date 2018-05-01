import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
// ADDED
import { UserProvider } from '../../providers/user/user'
// import { ConnectionProvider } from '../../providers/connection/connection'
import { ConfigProvider } from '../../providers/config/config'

import { TabsUserPage } from '../../pages/tabs-user/tabs-user';

// const URL = 'http://localhost:8000/api/all_users';
const URL = 'http://test.sotfall.com/api/all_users';

@Component({
  selector: 'page-all-users',
  templateUrl: 'all-users.html',
})
export class AllUsersPage {
  public users: any[];

  constructor(public navCtrl: NavController,
    public appCtrl: App,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public userData: UserProvider,
    public config: ConfigProvider) {
    this.users = [];
    // Need to check if there is a connection
    // this.connection.checkConnection()
  }

  // ONLY CALLED ONCE
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AllUsersPage');
  // }

  // Will check each time we go to this page
  ionViewWillEnter () {
    // this.connection.checkConnection()
    this.getAllUsers();
  }

  // ONLY CALLED ONCE
  // ionViewdidEnter () {
  //   console.log('ionViewDidEnter AllUsersPage');
  // }

  editUser(user) {

  }

  deleteUser(user) {
    let prompt = this.alertCtrl.create({
      title: 'Delete User',
      inputs: [{
        name: 'title'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            // this.notes.push(data);
          }
        }
      ]
    });
    prompt.present();
  }

  getAllUsers () {
    // let isConnected = this.connection.hasNetworkConnection()
    // console.log("HasNetworkConnection: " + isConnected)
    // if (isConnected) {
    if (this.config.networkStatus) {
      let loader = this.loading.create({
        spinner: 'ios',
        content: 'Getting the list of the registered users...',
      });

      // Show a spinner while loading
      loader.present().then(
        () => {
          this.http
            .get(URL)
            .subscribe(
              data => {
                this.users = data['users'];
              },
              error => {
                console.log("Error #" + error.status + " (" + error.error.message + ")");
              },
              // After a success or an error, stop the loader
              // Void function
              () => {
                loader.dismiss();
              }
            );
        }
      );
    } else {
      let toast = this.toastCtrl.create({
        closeButtonText: 'Ok',
        showCloseButton: true,
        message: 'You can\'t do this without internet. You need to activate "Mobile data" or "Wi-Fi" of your smartphone to be connected to the server and to retrieve data from it.',
        position: 'middle',
        cssClass: 'toast-style'
      });
      // console.log("Go to another tab...")
      toast.present();
      // Set the root page to UserPage and load it
      // this.appCtrl.getRootNav().setRoot(TabsUserPage);

      // Change because of the message from ionic:
      // (getRootNav) is deprecated and will be removed in the next major release.
      // Use getRootNavById instead.
      this.appCtrl.getRootNavs()[0].setRoot(TabsUserPage);
    }
  }
}
