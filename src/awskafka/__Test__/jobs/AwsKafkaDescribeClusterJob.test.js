// Global Libraries
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaDescribeClusterJob from "../../jobs/AwsKafkaDescribeClusterJob.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// start
test("start() - success", (done) => {
  const testAwsKafkaDescribeClusterJob = new AwsKafkaDescribeClusterJob("testArn");
  const asyncProcess = testAwsKafkaDescribeClusterJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaDescribeClusterJob.start()
  .then((describedCluster) => {
    expect(describedCluster).toEqual("testDescribeCluster");
    done();
  })
  asyncProcess.publishToDataSubscribers("testDescribeCluster");
  asyncProcess.kill();
});

test("start() - error", (done) => {
  const testAwsKafkaDescribeClusterJob = new AwsKafkaDescribeClusterJob("testArn");
  const asyncProcess = testAwsKafkaDescribeClusterJob.asyncProcess;
  asyncProcess.isAlive = false;
  testAwsKafkaDescribeClusterJob.start()
  .catch((error) => {
    expect(error).toEqual("Unable to connect to and describe Kafka Cluster:\ntestError");
    done();
  })
  asyncProcess.publishToErrorSubscribers("testError");
  asyncProcess.kill();
});
