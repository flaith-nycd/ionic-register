import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
/*
  Generated class for the SetupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectionProvider {

  protected isConnected:boolean
  protected connectionType:string

  constructor(private network: Network) {
    this.isConnected = false
    this.connectionType = this.network.type
    this.checkConnection()
  }

  checkConnection () {
    this.network.onConnect().subscribe(res => {
      this.isConnected = true
    })

    this.network.onDisconnect().subscribe(res => {
      this.isConnected = false
    })
    
    // console.log("Connected: " + this.isConnected)
    // console.log("Type: " + this.getConnectionType())
  }

  hasNetworkConnection () {
    return this.isConnected
  }

  getConnectionType () {
    return this.connectionType
  }

}
