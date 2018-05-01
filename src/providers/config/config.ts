import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {

  public networkStatus: boolean
  public networkType: string

  /**
   * Config provider to keep some variable globally
   */
  constructor() { }

}
