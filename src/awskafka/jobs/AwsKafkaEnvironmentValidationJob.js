// Libraries
import AwsKafkaValidations from "../AwsKafkaValidations.js";

class AwsKafkaEnvironmentValidationJob {
  constructor(awsKafkaArn, awsRegion) {
    this.awsKafkaArn = awsKafkaArn;
    this.awsRegion = awsRegion;
  }

  start() {
    return new Promise((resolve, reject) => {
      const awsKafkaArn = this.awsKafkaArn;
      const awsRegion = this.awsRegion;

      // Kafka AWS Arn
      if(!AwsKafkaValidations.validateAwsArn(awsKafkaArn)) {
        reject(
          `Invalid Kafka Arguments - Invalid Kafka Arn: ` +
          `${awsKafkaArn || "undefined"}`
        );
        return;
      }

      // Kafka AWS Region
      if(!AwsKafkaValidations.validateAwsRegion(awsRegion)) {
        reject(
          `Invalid Kafka Arguments - Invalid AWS Region: ` +
          `${awsRegion || "undefined"}`
        );
        return;
      }

      // Environment Validation good to go
      resolve("No errors.");
    });
  }
}
export default AwsKafkaEnvironmentValidationJob;
