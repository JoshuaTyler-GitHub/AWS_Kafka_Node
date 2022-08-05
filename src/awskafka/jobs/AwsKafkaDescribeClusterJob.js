// Libraries
import AwsKafkaDescribeCluster from "../asyncprocesses/AwsKafkaDescribeCluster.js";

class AwsKafkaDescribeClusterJob {
  constructor(awsKafkaArn) {
    const asyncProcess =  new AwsKafkaDescribeCluster(awsKafkaArn, true);
    this.asyncProcess = asyncProcess;
    this.error = false;
  }

  start() {
    return new Promise((resolve, reject) => {
      const asyncProcess = this.asyncProcess;
      
      // data
      asyncProcess.subscribeToData((data) => resolve(data));
      
      // error
      asyncProcess.subscribeToError((error) => {
        reject(`Unable to connect to and describe Kafka Cluster:\n${error}`);
      });

      // execute
      asyncProcess.execute();
    });
  }
}
export default AwsKafkaDescribeClusterJob;
