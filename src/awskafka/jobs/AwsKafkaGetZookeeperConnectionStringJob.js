// Libraries
import AwsKafkaGetZookeeperConnectionString from "../asyncprocesses/AwsKafkaGetZookeeperConnectionString.js";

class AwsKafkaGetZookeeperConnectionStringJob {
  constructor(awsKafkaArn, awsRegion) {
    const asyncProcess =  new AwsKafkaGetZookeeperConnectionString(awsKafkaArn, awsRegion, true);
    this.asyncProcess = asyncProcess;
    this.error = false;
    this.zookeeperConnectionString = null;
  }

  handleZookeeperConnectionString(data) {
    const describedCluster = JSON.parse(data);
    if(describedCluster.hasOwnProperty("ClusterInfo") &&
      describedCluster.ClusterInfo.hasOwnProperty("ZookeeperConnectString")
    ) {
      this.zookeeperConnectionString = describedCluster.ClusterInfo.ZookeeperConnectString;
    }
    else {
      this.error = "Zookeeper configuration incorrect, missing ZookeeperConnectString in Kafka ClusterInfo.";
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      const asyncProcess = this.asyncProcess;
      
      // data
      asyncProcess.subscribeToData((data) => this.handleZookeeperConnectionString(data));
      
      // error
      asyncProcess.subscribeToError((error) => this.error = error);

      // exit
      asyncProcess.onExit = () => {
        if(!this.error) {
          resolve(this.zookeeperConnectionString);
        }
        else {
          reject(`Unable to connect to Kafka Zookeeper:\n${this.error}`);
        }
      };

      // execute
      asyncProcess.execute();
    });
  }
}
export default AwsKafkaGetZookeeperConnectionStringJob;
