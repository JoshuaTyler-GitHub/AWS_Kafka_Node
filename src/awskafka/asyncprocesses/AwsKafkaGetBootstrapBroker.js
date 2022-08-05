// Libraries
import AsyncProcess from "./AsyncProcess.js";

class AwsKafkaGetBootstrapBroker extends AsyncProcess {
  constructor(awsKafkaArn, awsRegion, awaitExecution) {
    super(
      { /* No Arguments */ },
      (
        `aws kafka get-bootstrap-brokers ` +
        `--region ${awsRegion} ` +
        `--cluster-arn ${awsKafkaArn}`
      ),
      awaitExecution
    );
  }
}
export default AwsKafkaGetBootstrapBroker;