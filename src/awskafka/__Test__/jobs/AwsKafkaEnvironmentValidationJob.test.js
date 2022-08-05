// Global Libraries
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AwsKafkaEnvironmentValidationJob from "../../jobs/AwsKafkaEnvironmentValidationJob.js";

// Constants - Local
const TEST_ARN = "arn:aws:cloudformation:us-east-1:949307069509/TestKafkaStack/f84bafb0-ef1a-11eb-83fd-0ed2247e0ea9";
const TEST_REGION = "us-east-1";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// start
test("start() - valid", (done) => {
  const testAwsKafkaEnvironmentValidationJob = new AwsKafkaEnvironmentValidationJob(
    TEST_ARN,
    TEST_REGION,
  );
  testAwsKafkaEnvironmentValidationJob.start()
    .then((report) => {
      expect(report).toEqual("No errors.");
      done();
    });
});

test("start() - invalid awsKafkaArn", (done) => {
  const testAwsKafkaEnvironmentValidationJob = new AwsKafkaEnvironmentValidationJob(
    "",
    TEST_REGION,
  );

  testAwsKafkaEnvironmentValidationJob.start()
    .catch((error) => {
      expect(error).toEqual("Invalid Kafka Arguments - Invalid Kafka Arn: undefined");
      done();
    });
});

test("start() - invalid awsKafkaRegion", (done) => {
  const testAwsKafkaEnvironmentValidationJob = new AwsKafkaEnvironmentValidationJob(
    TEST_ARN,
    "",
  );

  testAwsKafkaEnvironmentValidationJob.start()
    .catch((error) => {
      expect(error).toEqual("Invalid Kafka Arguments - Invalid AWS Region: undefined");
      done();
    });
});
