// Global Libraries
import { expect } from "@jest/globals";
import { spyOn } from "jest-mock";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import Exception from "../../exceptions/Exception.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - with args
test("constructor(message, name, debug) - with args", () => {
  const spyReadout = spyOn(Exception.prototype, "getExceptionReadout");
  const testMessage = "testMessage";
  const testName = "testName";
  const testDebug = { debug: "debug" };
  const testException = new Exception(testMessage, testName, testDebug);

  expect(testException.hasOwnProperty("code")).toEqual(true);
  expect(testException.hasOwnProperty("message")).toEqual(true);
  expect(testException.hasOwnProperty("name")).toEqual(true);
  expect(testException.message).toEqual(testMessage);
  expect(testException.name).toEqual(testName);
  expect(spyReadout).toHaveBeenCalledTimes(1);
  spyReadout.mockClear();
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const spyReadout = spyOn(Exception.prototype, "getExceptionReadout");
  const testException = new Exception();

  expect(testException.hasOwnProperty("code")).toEqual(true);
  expect(testException.hasOwnProperty("message")).toEqual(true);
  expect(testException.hasOwnProperty("name")).toEqual(true);
  expect(testException.message).toEqual("No message available.");
  expect(testException.name).toEqual("Unnamed Exception");
  expect(spyReadout).toHaveBeenCalledTimes(1);
  spyReadout.mockClear();
});

// getMessage
test("getMessage()", () => {
  const testMessage = "testMessage";
  const testName = "testName";
  const testDebug = { debug: "debug" };
  const testException = new Exception(testMessage, testName, testDebug);
  expect(testException.getMessage()).toEqual(testMessage);
});

// getName
test("getName()", () => {
  const testMessage = "testMessage";
  const testName = "testName";
  const testDebug = { debug: "debug" };
  const testException = new Exception(testMessage, testName, testDebug);
  expect(testException.getName()).toEqual(testName);
});

// getExceptionReadout
test("getExceptionReadout()", () => {
  const testMessage = "testMessage";
  const testName = "testName";
  const testDebug = { debug: "debug" };
  const testException = new Exception(testMessage, testName, testDebug);
  expect(testException.getExceptionReadout()).toEqual(`${testName}:\n${testMessage}`);
});