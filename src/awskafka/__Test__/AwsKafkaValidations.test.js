// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaValidations from "../AwsKafkaValidations.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// validate AWS ARN
test("validateAwsArn()", () => {
  // ^(arn).*\S.*
  // Should Pass
  expect(AwsKafkaValidations.validateAwsArn("arn:aws:cloudformation:us-east-1:949307069509/TestKafkaStack/f84bafb0-ef1a-11eb-83fd-0ed2247e0ea9")).toEqual(true);

  // Should Fail
  expect(AwsKafkaValidations.validateAwsArn(undefined)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn(null)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn("")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn("askhfasdjklg")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn(1)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn(true)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn(false)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsArn("arn:notvalid")).toEqual(false);
});

// validate AWS Kafka Topic Name
test("validateAwsKafkaTopicName()", () => {
  // Should Pass
  expect(AwsKafkaValidations.validateAwsKafkaTopicName("testTopicName")).toEqual(true);

  // Should Fail
  expect(AwsKafkaValidations.validateAwsKafkaTopicName("test Topic Name")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(undefined)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(null)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName("")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(" ")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(1)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(true)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsKafkaTopicName(false)).toEqual(false);
});

// validate AWS Region
test("validateAwsRegion()", () => {
  // (us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d
  // Should Pass
  expect(AwsKafkaValidations.validateAwsRegion("us-east-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("us-east-2")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("us-west-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("us-west-2")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("us-gov-east-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("us-gov-west-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("af-south-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-south-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-northeast-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-northeast-2")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-northeast-3")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-southeast-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ap-southeast-2")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("ca-central-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-central-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-north-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-south-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-west-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-west-2")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("eu-west-3")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("me-south-1")).toEqual(true);
  expect(AwsKafkaValidations.validateAwsRegion("sa-east-1")).toEqual(true);

  // Should Fail
  expect(AwsKafkaValidations.validateAwsRegion(undefined)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion(null)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion("")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion("askhfasdjklg")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion(1)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion(true)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion(false)).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion("not-a-region")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion("us-notacardinal-1")).toEqual(false);
  expect(AwsKafkaValidations.validateAwsRegion("no-central-1")).toEqual(false);
});
