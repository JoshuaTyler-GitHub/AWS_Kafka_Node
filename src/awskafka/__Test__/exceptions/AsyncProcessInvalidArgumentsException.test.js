// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AsyncProcessInvalidArgumentsException from "../../exceptions/AsyncProcessInvalidArgumentsException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new AsyncProcessInvalidArgumentsException();
  expect(testException.message).toEqual("Async Process has an invalid command line interface and/or arguments.");
  expect(testException.name).toEqual("AsyncProcessInvalidArguments");
});
