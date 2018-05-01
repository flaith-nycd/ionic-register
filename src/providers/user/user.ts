import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {
  public hasToken: boolean;
  public name: string;
  public unique_token: string;

  constructor(public http: HttpClient, public storage: Storage, public zone: NgZone) {
    // By default, there is no user
    this.hasToken = false;
    this.name = "";
    this.unique_token = "";
    this.getUserAccount();
  }

  /**
   * get user information
   * and update his status
   */
  getUserAccount() {
    // Use NgZone to be sure to update the 'Home' view
    this.zone.run(() => {
      this.storage
      .get('__user_account')
      .then((user) => {
        if (user != null) {
          this.hasToken = true
          this.name = user.name
          this.unique_token = user.unique_token
        }
      });
    })
  }

  /**
   * Current user is loggeed?
   */
  isLoggedIn() {
    return this.hasToken;
  }
}
