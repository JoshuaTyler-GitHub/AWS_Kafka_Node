// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import BootstrapBrokerNotFoundException from "../../exceptions/BootstrapBrokerNotFoundException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new BootstrapBrokerNotFoundException();
  expect(testException.message).toEqual("Unable to locate BootstapBroker.");
  expect(testException.name).toEqual("BootstrapBrokerNotFound");
});
