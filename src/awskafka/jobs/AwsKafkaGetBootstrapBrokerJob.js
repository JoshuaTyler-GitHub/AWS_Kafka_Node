// Libraries
import AwsKafkaGetBootstrapBroker from "../asyncprocesses/AwsKafkaGetBootstrapBroker.js";

class AwsKafkaGetBootstrapBrokerJob {
  constructor(awsKafkaArn, awsRegion) {
    const asyncProcess =  new AwsKafkaGetBootstrapBroker(awsKafkaArn, awsRegion, true);
    this.asyncProcess = asyncProcess;
    this.bootstrapBroker = null;
    this.error = false;
  }

  handleBootstrapBroker(data) {
    const bootstrapBrokers = JSON.parse(data);
    if(bootstrapBrokers.hasOwnProperty("BootstrapBrokerStringTls")) {
      this.bootstrapBroker = bootstrapBrokers["BootstrapBrokerStringTls"];
    }
    else {
      this.error = "BootstrapBroker configuration incorrect, missing BootstrapBrokerStringTls.";
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      const asyncProcess = this.asyncProcess;
      
      // data
      asyncProcess.subscribeToData((data) => this.handleBootstrapBroker(data));
      
      // error
      asyncProcess.subscribeToError((error) => this.error = error);

      // exit
      asyncProcess.onExit = () => {
        if(!this.error) {
          resolve(this.bootstrapBroker);
        }
        else {
          reject(`Unable to connect to Kafka Bootstrap Broker:\n${this.error}`);
        }
      };

      // execute
      asyncProcess.execute();
    });
  }
}
export default AwsKafkaGetBootstrapBrokerJob;
