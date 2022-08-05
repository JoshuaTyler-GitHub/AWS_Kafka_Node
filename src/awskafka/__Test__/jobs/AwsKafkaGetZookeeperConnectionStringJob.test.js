// Global Libraries
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaGetZookeeperConnectionStringJob from "../../jobs/AwsKafkaGetZookeeperConnectionStringJob.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// handleZookeeperConnectionString - valid
test("handleZookeeperConnectionString()", () => {
  const validZookeeperConnectionString = JSON.stringify({ "ClusterInfo": { "ZookeeperConnectString": "testZookeeperConnectString" } });

  const testAwsKafkaGetZookeeperConnectionStringJob = new AwsKafkaGetZookeeperConnectionStringJob("testArn", "testRegion");
  testAwsKafkaGetZookeeperConnectionStringJob.handleZookeeperConnectionString(validZookeeperConnectionString);
  expect(testAwsKafkaGetZookeeperConnectionStringJob.zookeeperConnectionString).toEqual("testZookeeperConnectString");
});

// handleZookeeperConnectionString - invalid
test("handleZookeeperConnectionString()", () => {
  const invalidZookeeperConnectionString = JSON.stringify({ "_notvalid_CluserInfo": { "ZookeeperConnectString": "testZookeeperConnectString" } });

  const testAwsKafkaGetZookeeperConnectionStringJob = new AwsKafkaGetZookeeperConnectionStringJob("testArn", "testRegion");
  testAwsKafkaGetZookeeperConnectionStringJob.handleZookeeperConnectionString(invalidZookeeperConnectionString);
  expect(testAwsKafkaGetZookeeperConnectionStringJob.error).toEqual("Zookeeper configuration incorrect, missing ZookeeperConnectString in Kafka ClusterInfo.");
});

// start
test("start() - success", (done) => {
  const testAwsKafkaZookeeperConnectionStringJob = new AwsKafkaGetZookeeperConnectionStringJob("testArn", "testRegion");
  const asyncProcess = testAwsKafkaZookeeperConnectionStringJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaZookeeperConnectionStringJob.start()
  .then((zookeeperConnectionString) => {
    expect(zookeeperConnectionString).toEqual("testZookeeperConnectionString");
    done();
  })
  asyncProcess.publishToDataSubscribers(
    JSON.stringify({ ClusterInfo: { ZookeeperConnectString: "testZookeeperConnectionString"}})
  );
  asyncProcess.kill();
});

test("start() - error", (done) => {
  const testAwsKafkaZookeeperConnectionStringJob = new AwsKafkaGetZookeeperConnectionStringJob("testArn", "testRegion");
  const asyncProcess = testAwsKafkaZookeeperConnectionStringJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaZookeeperConnectionStringJob.start()
  .catch((error) => {
    expect(error).toEqual("Unable to connect to Kafka Zookeeper:\ntestError");
    done();
  })
  asyncProcess.publishToErrorSubscribers("testError");
  asyncProcess.kill();
});
