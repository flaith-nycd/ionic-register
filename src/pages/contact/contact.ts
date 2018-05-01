import { Component } from '@angular/core';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// ADDED
import { UserProvider } from '../../providers/user/user'

const URL = 'http://test.sotfall.com/api/send_message';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  /**
   * @public
   * Property to assign a FormGroup object to
   */
  public form: FormGroup;

  public subject: string;

  constructor(public navCtrl: NavController, public userData: UserProvider, public http: HttpClient, public toastCtrl: ToastController, private _ALERT: AlertController, private _FORM: FormBuilder) {
    // Create a FormGroup object to implement validation
    // on the template fields
    // VERY basic validation as you can see - I.e. NO empty fields!
    this.form = this._FORM.group({
      "message": ["", Validators.required]
    });

    this.subject = "Test envoi message";
  }

  sendMessage () {
    let message = this.form.controls["message"].value;
    this.sendMessageToServer(this.subject, message);
  }

  // While leaving the view, we set the message to 'empty'
  ionViewDidLeave () {
    this.form.controls["message"].setValue("");
  }

  private showToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'middle',
      cssClass: 'toast-style'
    });
    toast.present();
  }

  private showToastError(text) {
    let toast = this.toastCtrl.create({
      closeButtonText: 'Ok',
      showCloseButton: true,
      message: text,
      position: 'middle',
      cssClass: 'toast-style'
    });
    toast.present();
  }

  sendMessageToServer (subject, body) {
    // Envoi vers le serveur (en POST)
    // avec le token, le sujet et le message
    // Sur le serveur, il faut créer un Listener qui,
    // lors de la réception de ce message, previendra
    // le reponsable (donc créer un role dans la table Users)
    // Et sur l'application du responsable sur son téléphone
    // avoir un thread qui verifiera s'il a reçu un message
    // puis le notifiera.

    var userMessageToSend =
      {
        from_token: this.userData.unique_token,
        subject: subject,
        body: body
      };

    // Now post the message to the remote server
    this.http
      .post(URL, userMessageToSend)
      .subscribe(
        data => {
          // Show a temporary notification
          // this.showToast();
          // console.log(data['message']);
          this.showToast("Message sent");
        },
        error => {
          // this.userData.hasToken = false;

          // Set the view
          // this.viewUser.response = "Error #" + error.status + " (" + error.error.message + ")";
          // console.log("Error #" + error.status + " (" + error.error.message + ")");
          this.showToastError("Error #" + error.status + "\n" + error.error.message);
        }
      );
  }
}
