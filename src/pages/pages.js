// import { Settings } from "../core/settings";
import { DeferredPromise } from "../core/promise";
import { Logger } from "../core/logger";
import { IonicPlatform } from "../core/core";
// import { EventEmitter } from "../core/events";

// var settings = new Settings();

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

  fetchPages() {
    var q = new DeferredPromise();

    setTimeout(function() {
      q.resolve([
        {
          stateConfig: {
            state: 'about',
            url: '/about',
            templateUrl: 'about-page.html'
          },

          html: `
          <ion-view view-title="Dynamic Page">
            <ion-content class="padding">
              <h2>This is a dynamic page!</h2>
              <p>
                How cool is this shit?
              </p>
              <div class="custom-thing">
                This is a custom thing. How darn cool?
              </div>
              <button ng-click="doClicker()" class="button button-primary">Click me, I dare ya!</button>
            </ion-content>
          </ion-view>
          `,
          css: `
          .custom-thing {
            background-color: red;
            color: white;
            padding: 20px;
          }
          `,
          js: `
          angular.module('ionic').controller('MyController', function($scope) {
            console.log('COntrolle running');
            $scope.doClicker = function() {
              alert('CLICKER!!!');
            }
          })
          `
        }
      ]);
    });

    return q.promise;
  }

}
