// Libraries
import AsyncProcess from "./AsyncProcess.js";

class AwsKafkaGetZookeeperConnectionString extends AsyncProcess {
  constructor(awsKafkaArn, awsRegion, awaitExecution) {
    super(
      { /* No Arguments */ },
      (
        `aws kafka describe-cluster ` +
        `--region ${awsRegion} ` +
        `--cluster-arn ${awsKafkaArn}`
      ),
      awaitExecution
    );
  }
}
export default AwsKafkaGetZookeeperConnectionString;
