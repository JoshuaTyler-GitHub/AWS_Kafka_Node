// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import ZookeeperConnectionStringNotFoundException from "../../exceptions/ZookeeperConnectionStringNotFoundException.js";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor - no args
test("constructor(message, name, debug) - no args", () => {
  const testException = new ZookeeperConnectionStringNotFoundException();
  expect(testException.message).toEqual("Unable to locate ZookeeperConnectionString.");
  expect(testException.name).toEqual("ZookeeperConnectionStringNotFound");
});
