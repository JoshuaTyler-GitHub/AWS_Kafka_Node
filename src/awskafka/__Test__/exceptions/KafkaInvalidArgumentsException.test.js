// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import KafkaInvalidArgumentsException from "../../exceptions/KafkaInvalidArgumentsException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new KafkaInvalidArgumentsException();
  expect(testException.message).toEqual("Invalid AWS Region or Kafka ARN.");
  expect(testException.name).toEqual("KafkaInvalidArguments");
});
