// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "BootstrapBrokerNotFound";
const MESSAGE_DEFAULT = "Unable to locate BootstapBroker.";

class BootstrapBrokerNotFoundException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default BootstrapBrokerNotFoundException;
