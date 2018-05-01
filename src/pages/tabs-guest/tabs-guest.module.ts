import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsGuestPage } from './tabs-guest';

@NgModule({
  declarations: [
    TabsGuestPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsGuestPage),
  ],
})
export class TabsGuestPageModule {}
