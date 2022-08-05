// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "KafkaInvalidArguments";
const MESSAGE_DEFAULT = "Invalid AWS Region or Kafka ARN.";

class KafkaInvalidArgumentsException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default KafkaInvalidArgumentsException;
