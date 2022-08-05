// Constants - Local
const AWS_ARN_REGEX = "^(arn).*\S.*";
const AWS_REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "us-gov-east-1",
  "us-gov-west-1",
  "af-south-1",
  "ap-south-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-southeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "eu-central-1",
  "eu-north-1",
  "eu-south-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "me-south-1",
  "sa-east-1"
];

class AwsKafkaValidations {
  static validateAwsArn(awsArn) {
    if(!awsArn) return false;
    return new RegExp(AWS_ARN_REGEX).test(awsArn);
  }

  static validateAwsKafkaTopicName(topicName) {
    if(!topicName || typeof(topicName) !== "string") {
      return false;
    }
    topicName = String(topicName).trim();
    return !topicName.includes(" ") && topicName.length > 0;
  }

  static validateAwsRegion(awsRegion) {
    if(!awsRegion) return false;
    return AWS_REGIONS.includes(awsRegion);
  }
}
export default AwsKafkaValidations;
