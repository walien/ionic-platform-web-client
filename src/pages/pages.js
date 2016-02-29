import { Settings } from "../core/settings";
import { DeferredPromise } from "../core/promise";
import { Logger } from "../core/logger";
import { IonicPlatform } from "../core/core";
import { EventEmitter } from "../core/events";

var settings = new Settings();

export class Pages {

  /**
   * Ionic Pages
   *
   * This is the client-side portion of the Ionic Pages service, a remote page content editing/admin service
   * for Ionic and Cordova apps.
   *
   * To use:
   *
   * ```javascript
   * Ionic.Pages.init();
   * ```
   * @constructor
   */
  constructor() {
    var self = this;
    this.logger = new Logger({
      'prefix': 'Ionic Pages:'
    });

    self._isReady = false;

    this.logger.info("init");
    IonicPlatform.getMain().onReady(function() {
      self.initialize();
      self._isReady = true;
      self._emitter.emit('ionic_pages:ready');
    });
  }

  /**
   * @return {void}
   */
  initialize() {
  }

}
