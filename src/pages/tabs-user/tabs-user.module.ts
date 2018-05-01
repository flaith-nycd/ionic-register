import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsUserPage } from './tabs-user';

@NgModule({
  declarations: [
    TabsUserPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsUserPage),
  ],
})
export class TabsUserPageModule {}
