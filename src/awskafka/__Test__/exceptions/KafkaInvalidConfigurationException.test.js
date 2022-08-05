// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import KafkaInvalidConfigurationException from "../../exceptions/KafkaInvalidConfigurationException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new KafkaInvalidConfigurationException();
  expect(testException.message).toEqual("Invalid AWS Kafka Configuration in src/resources/Config.json.");
  expect(testException.name).toEqual("KafkaInvalidConfiguration");
});
