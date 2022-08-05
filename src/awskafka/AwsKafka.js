// Libraries
import { Kafka } from "kafkajs";
import LoggerUtils from "../utils/LoggerUtils.js";

// Exceptions
import KafkaInvalidArgumentsException from "./exceptions/KafkaInvalidArgumentsException.js";
import KafkaInvalidConfigurationException from "./exceptions/KafkaInvalidConfigurationException.js";

// Jobs
import AwsKafkaEnvironmentValidationJob from "./jobs/AwsKafkaEnvironmentValidationJob.js";
import AwsKafkaGetBootstrapBrokerJob from "./jobs/AwsKafkaGetBootstrapBrokerJob.js";
import AwsKafkaGetZookeeperConnectionStringJob from "./jobs/AwsKafkaGetZookeeperConnectionStringJob.js";

// Constants - Global
import AwsKafkaConfig from "./AwsKafkaConfig.json";

class AwsKafka {
  static admin = null;
  static bootstrapBrokers = null;
  static consumers = {};
  static kafkaEnvironment = null;
  static producer = null;
  static zookeeperConnectionString = null;

  /*====================
  Kafka Initilization & Shutdown
  ====================*/
  static initialize = async() => {
    const awsKafkaArn = AwsKafkaConfig.kafka.arn;
    const awsRegion = AwsKafkaConfig.region;
    const awsKafkaEnvironmentValidationJob = new AwsKafkaEnvironmentValidationJob(awsKafkaArn, awsRegion);
    await awsKafkaEnvironmentValidationJob.start()
    .then(async () => {
      try {
        // Bootstrap Brokers
        AwsKafka.bootstrapBrokers = await AwsKafka.getBootstrapBrokers(awsKafkaArn, awsRegion);
        LoggerUtils.info("BootstrapBroker successfully acquired.");

        // ZookeeperConnectionString
        AwsKafka.zookeeperConnectionString = await AwsKafka.getZookeeperConnectionString(awsKafkaArn, awsRegion);
        LoggerUtils.info("ZookeeperConnectionString successfully acquired.");

        // Kafka Connection
        AwsKafka.kafkaEnvironment = new Kafka({
          brokers: [
            AwsKafka.bootstrapBrokers.split(",")[0],
            AwsKafka.bootstrapBrokers.split(",")[1],
            AwsKafka.bootstrapBrokers.split(",")[2]
          ],
          clientId: "msk-lambda",
          ssl: true,
        });
        AwsKafka.admin = await AwsKafka.kafkaEnvironment.admin();
        await AwsKafka.admin.connect();

        LoggerUtils.info("AwsKafka Initialization Complete.");
        return "AwsKafka Initialization Complete.";
      }
      catch(error) {
        throw new KafkaInvalidConfigurationException(error);
      }
    })
    .catch((error) => {
      if(error && String(error).includes("Invalid Kafka Arguments")) {
        throw new KafkaInvalidArgumentsException(error);
      }
      else {
        throw new KafkaInvalidConfigurationException(error);
      }
    });
  }

  static shutdown() {
    return new Promise((resolve, reject) => {
      try {
        for(const key in AwsKafka.consumers) {
          if(AwsKafka.consumers[key]) {
            await AwsKafka.consumers[key].disconnect();
          }
        }
        if(AwsKafka.producer) {
          await AwsKafka.producer.disconnect();
        }
        resolve("Shutdown successful.");
      }
      catch(error) {
        LoggerUtils.error(error);
        reject(error)
      }
    });
  }

  /*====================
  Kafka Jobs
  ====================*/
  static createConsumer = async(topicName, fromBeginning, onTopicData) => {
    if(AwsKafka.consumers[topicName]) {
      return AwsKafka.consumers[topicName];
    }
    else {
      try {
        const consumer = await AwsKafka.kafkaEnvironment.consumer({ groupId: String("test-group") });
        AwsKafka.consumers[topicName] = consumer;
        await consumer.connect();
        await consumer.subscribe({ topic: "TestTopic", fromBeginning: fromBeginning });
        await consumer.run({ eachMessage: async (topicData) => onTopicData(topicData) });
        return consumer;
      }
      catch(error) {
        LoggerUtils.error(`Failed to createConsumer(${topicName}): ${error}`);
        return error;
      }
    }
  }

  static createProducer = async() => {
    if(AwsKafka.producer) {
      return AwsKafka.producer;
    }
    try {
      const producer = await AwsKafka.kafkaEnvironment.producer();
      AwsKafka.producer = producer;
      await producer.connect();
      return producer;
    }
    catch(error) {
      LoggerUtils.error(`AwsKafka - Failed to createProducer(): ${error}`);
      return error;
    }
  }

  static createTopic = async(topicName) => {
    try {
      const topicConfig = {
        topic: topicName,
        numPartitions: AwsKafkaConfig.kafka.partitionCount,
        replicationFactor: AwsKafkaConfig.kafka.replicationFactor,
      };
      return await AwsKafka.admin.createTopics({ topics: [ topicConfig ] });
    }
    catch(error) {
      LoggerUtils.error(`AwsKafka - Failed to createTopic(${topicName}): ${error}`);
      return error;
    }
  };

  static deleteTopic = async(topicName) => {
    try {
      return await AwsKafka.admin.deleteTopics({ topics: [ topicName ] });
    }
    catch(error) {
      LoggerUtils.error(`AwsKafka - Failed to deleteTopic(${topicName}): ${error}`);
      return error;
    }
  };

  static getBootstrapBrokers = async(awsKafkaArn, awsRegion) => {
    const getBootstrapBrokerJob = new AwsKafkaGetBootstrapBrokerJob(awsKafkaArn, awsRegion);
    return await getBootstrapBrokerJob.start();
  }

  static getTopics = async() => {
    try {
      return await AwsKafka.admin.listTopics();
    }
    catch(error) {
      LoggerUtils.error(`AwsKafka - Failed to getTopics(): ${error}`);
      return error;
    }
  }

  static getZookeeperConnectionString = async(awsKafkaArn, awsRegion) => {
    const getBootstrapBrokerJob = new AwsKafkaGetZookeeperConnectionStringJob(awsKafkaArn, awsRegion);
    return await getBootstrapBrokerJob.start();
  }

  static publishToTopic = async(topicName, topicData) => {
    try {
      if(!AwsKafka.producer) {
        await AwsKafka.createProducer();
      }

      return await AwsKafka.producer.send({
        topic: String(topicName),
        messages: [ JSON.stringify(topicData) ]
      });
    }
    catch(error) {
      LoggerUtils.error(`AwsKafka - Failed to publishToTopic(${topicName}, ${topicData}): ${error}`);
      return error;
    }
  }

  /*====================
  Kafka Utility
  ====================*/
  static getKafkaClusterInformation() {
    return {
      arn: String(AwsKafkaConfig.kafka.arn),
      bootstrapBrokers: String(AwsKafka.bootstrapBrokers),
      partitionCount: String(AwsKafkaConfig.kafka.partitionCount),
      region: String(AwsKafkaConfig.region),
      replicationFactor: String(AwsKafkaConfig.kafka.replicationFactor),
      zookeeperConnectionString: String(AwsKafka.zookeeperConnectionString),
    }
  }
}
export default AwsKafka;
