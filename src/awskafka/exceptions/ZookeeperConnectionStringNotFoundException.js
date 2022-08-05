// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "ZookeeperConnectionStringNotFound";
const MESSAGE_DEFAULT = "Unable to locate ZookeeperConnectionString.";

class ZookeeperConnectionStringNotFoundException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default ZookeeperConnectionStringNotFoundException;
