// Libraries
import AsyncProcess from "./AsyncProcess.js";

class AwsKafkaDescribeCluster extends AsyncProcess {
  constructor(awsKafkaArn, awaitExecution) {
    super(
      { /* No Arguments */ },
      (
        `aws kafka describe-cluster ` +
        `--cluster-arn ${awsKafkaArn}`
      ),
      awaitExecution
    );
  }
}
export default AwsKafkaDescribeCluster;