// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaGetZookeeperConnectionString from "../../asyncprocesses/AwsKafkaGetZookeeperConnectionString.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor
test("constructor(awsKafkaArn, awsRegion, awaitExecution)", () => {
  const testAwsRegion = "us-east-1";
  const testAwsKafkaArn = "arn:us-east-1:kafka:testAwsKafkaArn";
  const testAwsKafkaGetZookeeperConnectionString = new AwsKafkaGetZookeeperConnectionString(
    testAwsKafkaArn,
    testAwsRegion,
    true
  );
  expect(testAwsKafkaGetZookeeperConnectionString.cli).toEqual(
    `aws kafka describe-cluster ` +
    `--region ${testAwsRegion} ` +
    `--cluster-arn ${testAwsKafkaArn}`
  );
});