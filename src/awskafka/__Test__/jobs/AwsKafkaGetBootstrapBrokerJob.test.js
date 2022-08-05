// Global Libraries
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaGetBootstrapBrokerJob from "../../jobs/AwsKafkaGetBootstrapBrokerJob.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// handleBootstrapBroker - valid
test("handleBootstrapBroker()", () => {
  const validBootstrapBroker = JSON.stringify({ "BootstrapBrokerStringTls": "testBootstrapBrokerStringTls" });

  const testAwsKafkaGetBootstrapBrokerJob = new AwsKafkaGetBootstrapBrokerJob("testArn", "testRegion");
  testAwsKafkaGetBootstrapBrokerJob.handleBootstrapBroker(validBootstrapBroker);
  expect(testAwsKafkaGetBootstrapBrokerJob.bootstrapBroker).toEqual("testBootstrapBrokerStringTls");
});

// handleBootstrapBroker - invalid
test("handleBootstrapBroker()", () => {
  const invalidBootstrapBroker = JSON.stringify({ "boostrapBrokerStringTls": "test_notvalid_BootstrapBrokerStringTls" });

  const testAwsKafkaGetBootstrapBrokerJob = new AwsKafkaGetBootstrapBrokerJob("testArn", "testRegion");
  testAwsKafkaGetBootstrapBrokerJob.handleBootstrapBroker(invalidBootstrapBroker);
  expect(testAwsKafkaGetBootstrapBrokerJob.error).toEqual("BootstrapBroker configuration incorrect, missing BootstrapBrokerStringTls.");
});

// start
test("start() - success", (done) => {
  const testAwsKafkaBootstrapBrokerJob = new AwsKafkaGetBootstrapBrokerJob("testArn", "testRegion");
  const asyncProcess = testAwsKafkaBootstrapBrokerJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaBootstrapBrokerJob.start()
  .then((bootstrapBroker) => {
    expect(bootstrapBroker).toEqual("testBootstrapBroker");
    done();
  })
  asyncProcess.publishToDataSubscribers(
    JSON.stringify({ BootstrapBrokerStringTls: "testBootstrapBroker" })
  );
  asyncProcess.kill();
});

test("start() - error", (done) => {
  const testAwsKafkaBootstrapBrokerJob = new AwsKafkaGetBootstrapBrokerJob("testArn", "testRegion");
  const asyncProcess = testAwsKafkaBootstrapBrokerJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaBootstrapBrokerJob.start()
  .catch((error) => {
    expect(error).toEqual("Unable to connect to Kafka Bootstrap Broker:\ntestError");
    done();
  })
  asyncProcess.publishToErrorSubscribers("testError");
  asyncProcess.kill();
});
