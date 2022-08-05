// Global Libraries
import { expect } from "@jest/globals";
import { spyOn } from "jest-mock";
import AwsKafkaConfig from "../AwsKafkaConfig.json";
import LoggerUtils from "../../utils/LoggerUtils.js";

// Testing Library
import AwsKafka from "../AwsKafka.js";
import AwsKafkaGetBootstrapBrokerJob from "../jobs/AwsKafkaGetBootstrapBrokerJob.js";
import AwsKafkaGetZookeeperConnectionStringJob from "../jobs/AwsKafkaGetZookeeperConnectionStringJob.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// // initialize
// test("initialize() - valid", (done) => {
//   const testAwsKafkaArn = "testAwsKafkaArn";
//   const testAwsRegion = "testAwsRegion";
//   const testBootstrapBrokers = "testBootstrapBrokers";
//   const testKafkaBinDirectory = "testKafkaBinDirectory";
//   const testKafkaConfigDirectory = "testKafkaConfigDirectory";
//   const testZookeeperConnectionString = "testZookeeperConnectionString";

//   // mocks
//   const preMockEnvironmentValidationJobStart = AwsKafkaEnvironmentValidationJob.prototype.start;
//   const preMockGetBootstrapBroker = AwsKafka.getBootstrapBroker;
//   const preMockGetZookeeperConnectionString = AwsKafka.getZookeeperConnectionString;
//   AwsKafkaEnvironmentValidationJob.prototype.start = () => { return new Promise((resolve) => resolve()) };
//   AwsKafka.getBootstrapBroker = () => { return new Promise((resolve) => resolve(testBootstrapBrokers)) };
//   AwsKafka.getZookeeperConnectionString = () => { return new Promise((resolve) => resolve(testZookeeperConnectionString)) };

//   // bootstrapBrokers & zookeeperConnectionString are set
//   // no errors are thrown
//   AwsKafka.initialize(testAwsKafkaArn, testAwsRegion, testKafkaBinDirectory, testKafkaConfigDirectory);
//   expect(AwsKafka.bootstrapBrokers).toEqual(testBootstrapBrokers);
//   expect(AwsKafka.zookeeperConnectionString).toEqual(testZookeeperConnectionString);

//   // reset mocks
//   AwsKafkaEnvironmentValidationJob.prototype.start = preMockEnvironmentValidationJobStart;
//   AwsKafka.getBootstrapBroker = preMockGetBootstrapBroker;
//   AwsKafka.getZookeeperConnectionString = preMockGetZookeeperConnectionString;
//   done();
// });

// getBootstrapBroker
test("getBootstrapBroker()", () => {
  const preMock = AwsKafkaGetBootstrapBrokerJob.prototype.start;
  AwsKafkaGetBootstrapBrokerJob.prototype.start = () => {};
  const spyJob = spyOn(AwsKafkaGetBootstrapBrokerJob.prototype, "start");
  AwsKafka.getBootstrapBrokers();
  expect(spyJob).toHaveBeenCalledTimes(1);
  AwsKafkaGetBootstrapBrokerJob.prototype.start = preMock;
});

// getKafkaClusterInformation
test("getKafkaClusterInformation()", () => {
  const testBootstrapBrokers = "testBootstrapBrokers";
  const testZookeeperConnectionString = "testZookeeperConnectionString";
  AwsKafka.bootstrapBrokers = testBootstrapBrokers;
  AwsKafka.zookeeperConnectionString = testZookeeperConnectionString;
  const kafkaClusterInfo = AwsKafka.getKafkaClusterInformation();
  expect(kafkaClusterInfo.arn).toEqual(String(AwsKafkaConfig.kafka.arn));
  expect(kafkaClusterInfo.bootstrapBrokers).toEqual(String(testBootstrapBrokers));
  expect(kafkaClusterInfo.partitionCount).toEqual(String(AwsKafkaConfig.kafka.partitionCount));
  expect(kafkaClusterInfo.region).toEqual(String(AwsKafkaConfig.region));
  expect(kafkaClusterInfo.replicationFactor).toEqual(String(AwsKafkaConfig.kafka.replicationFactor));
  expect(kafkaClusterInfo.zookeeperConnectionString).toEqual(String(testZookeeperConnectionString));
});

// getZookeeperConnectionString
test("getZookeeperConnectionString()", () => {
  const preMock = AwsKafkaGetZookeeperConnectionStringJob.prototype.start;
  AwsKafkaGetZookeeperConnectionStringJob.prototype.start = () => {};
  const spyJob = spyOn(AwsKafkaGetZookeeperConnectionStringJob.prototype, "start");
  AwsKafka.getZookeeperConnectionString();
  expect(spyJob).toHaveBeenCalledTimes(1);
  AwsKafkaGetZookeeperConnectionStringJob.prototype.start = preMock;
});
