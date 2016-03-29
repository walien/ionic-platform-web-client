import { Settings } from "../core/settings";
import { Logger } from "../core/logger";

var settings = new Settings();

var Raven = window.Raven || undefined;

export class TraceService {
  constructor() {
    this.logger = new Logger({
      'prefix': 'Ionic Trace (dev):'
    });
    var apiToken = settings.get('sentry_token');
    if (!apiToken) {
      console.log("Missing sentry API token");
    } else {
      console.log("Sentry API token is: ", apiToken);
    }

    Raven.config('http://' + apiToken + '@localhost:9000/2')
      .install();
  }

  captureException(exc) {
    Raven.captureException(exc);
  }
}
