// Add Angular integrations if Angular is available
if ((typeof angular === 'object') && angular.module) {

  var IonicAngularPages = null;

  angular.module('ionic.service.pages', [])

  .factory('$ionicPages', [function() {
    if (!IonicAngularPages) {
      IonicAngularPages = new Ionic.Pages();
    }
    return IonicAngularPages;
  }]);
}
