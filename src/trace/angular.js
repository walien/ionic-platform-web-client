/**
 * Angular.js plugin
 *
 * Provides an $exceptionHandler for Angular.js
 * If angular is not available, Trace will not detect uncaught errors,
 * i.e. all exceptions must be passed via captureException.
 */
'use strict';

function TraceProvider() {
  this.$get = [function() {
    return Ionic.Trace;
  }];
}

function ExceptionHandlerProvider($provide) {
  $provide.decorator('$exceptionHandler',
      ['Raven', '$delegate', exceptionHandler]);
}

function exceptionHandler(R, $delegate) {
  return function(ex, cause) {
    R.captureException(ex, {
      'extra': { 'cause': cause }
    });
    $delegate(ex, cause);
  };
}

if ((typeof angular === 'object') && angular.module) {

  var Raven = window.Raven || undefined;

  // See https://github.com/angular/angular.js/blob/v1.4.7/src/minErr.js
  var angularPattern = /^\[((?:[$a-zA-Z0-9]+:)?(?:[$a-zA-Z0-9]+))\] (.+?)\n(\S+)$/;

  Raven.setDataCallback(function(data) {
    // We only care about mutating an exception
    var exception = data.exception;
    if (exception) {
      exception = exception.values[0];
      var matches = angularPattern.exec(exception.value);

      if (matches) {
        // This type now becomes something like: $rootScope:inprog
        exception.type = matches[1];
        exception.value = matches[2];
        data.message = exception.type + ': ' + exception.value;
        // auto set a new tag specifically for the angular error url
        data.extra.angularDocs = matches[3].substr(0, 250);
      }
    }
  });

  // Add Angular integrations if Angular is available
  angular.module('ionic.service.trace', [])
    .provider('$ionicTrace', TraceProvider)
    .config(['$provide', ExceptionHandlerProvider]);

}


