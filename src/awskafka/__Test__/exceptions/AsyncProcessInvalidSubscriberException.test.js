// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AsyncProcessInvalidSubscriberException from "../../exceptions/AsyncProcessInvalidSubscriberException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new AsyncProcessInvalidSubscriberException();
  expect(testException.message).toEqual("Only instances of functions can subscribe to AsyncProcess data or error feeds.");
  expect(testException.name).toEqual("AsyncProcessInvalidSubscriber");
});
