// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaGetBootstrapBroker from "../../asyncprocesses/AwsKafkaGetBootstrapBroker.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor
test("constructor(awsKafkaArn, awsRegion, awaitExecution)", () => {
  const testAwsRegion = "us-east-1";
  const testAwsKafkaArn = "arn:us-east-1:kafka:testAwsKafkaArn";
  const testAwsKafkaGetBootstrapBroker = new AwsKafkaGetBootstrapBroker(
    testAwsKafkaArn,
    testAwsRegion,
    true
  );
  expect(testAwsKafkaGetBootstrapBroker.cli).toEqual(
    `aws kafka get-bootstrap-brokers ` +
    `--region ${testAwsRegion} ` +
    `--cluster-arn ${testAwsKafkaArn}`
  );
});