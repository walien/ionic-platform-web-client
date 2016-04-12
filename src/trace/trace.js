import { Settings } from "../core/settings";

var settings = new Settings();
var apiToken = settings.get('sentry_token');
if (!apiToken) {
  console.log("Missing sentry API token");
} else {
  console.log("Sentry API token is: ", apiToken);
}

var Raven = window.Raven || undefined;
if (typeof Raven === 'object') {
  Raven.config('http://' + apiToken + '@localhost:9000/2').install();
}

export class Trace {
  static captureException(exc) {
    Raven.captureException(exc);
  }
}
