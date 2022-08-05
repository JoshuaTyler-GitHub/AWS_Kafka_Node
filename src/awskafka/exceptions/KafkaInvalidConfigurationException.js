// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "KafkaInvalidConfiguration";
const MESSAGE_DEFAULT = "Invalid AWS Kafka Configuration in src/resources/Config.json.";

class KafkaInvalidConfigurationException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default KafkaInvalidConfigurationException;
