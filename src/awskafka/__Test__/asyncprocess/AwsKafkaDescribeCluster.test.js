// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaDescribeCluster from "../../asyncprocesses/AwsKafkaDescribeCluster.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor
test("constructor(awsKafkaArn, awsRegion, awaitExecution)", () => {
  const testAwsKafkaArn = "arn:us-east-1:kafka:testAwsKafkaArn";
  const testAwsKafkaDescribeCluster = new AwsKafkaDescribeCluster(
    testAwsKafkaArn,
    true
  );
  expect(testAwsKafkaDescribeCluster.cli).toEqual(
    `aws kafka describe-cluster ` +
    `--cluster-arn ${testAwsKafkaArn}`
  );
});