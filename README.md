# MSK_Node
This application is a self-contained AWS Managed Stream Kafka Node. It serves as an ultra-lightweight wrapper to kafka_2.12-2.2.1, providing easy access to the shell scripts in a way that can be called like node_modules. The application includes a REST API and UI Dashboard for monitoring and debugging.

## Endpoints
  - "/consume", POST
  - "/environment", GET
  - "/health", GET
  - "/kafka", GET
  - "/produce", POST
  - "/status", GET
  - "/topics", DELETE, GET, POST

## How to run
To begin, setup the instance through AWS CloudFormation using the "src/cloudformation/MSK_Node_CloudFormation.yaml" template. The "iamPerms.json" file includes all the permissions a user will need to successfully deploy the stack.

<aws.kafka.arn>, <aws.region>, <serverPort>, and other properties can be set in the Config.json located in src/resources. <aws.kafka.arn> & <aws.region> must be set to match the CloudFormation Stack's values.

Install dependencies (express, jest, uuid).
npm install
npm test
npm start

"npm start" script:
node --experimental-json-modules index.js

# Code base overview
The src/resources and src/cstatemanagement setups help to consolidate single sources of truth for the application. Kafka configuration can be found under src/awskafka/kafka_2.12-2.2.1/config.

The Kafka shell scripts are run through the AsyncProcess class and each shell script has its own AsyncProcess extending the class and passing unique constructor arguments.

The AsyncProcesses are managed by their own unqiue wrapper class referred to as a "job" (e.g. AwsKafkaCreateTopicJob, AwsKafkaDeleteTopicJob, AwsKafkaConsumerJob).

Jobs are abstracted from view and using the Kafka service revolves around the AwsKafka.js script located in src/awskafka. The Kafka Jobs conveniently return promises and callbacks accessed in familiar ways as seen below:

```
AwsKafka.createTopic(topicName)
.then((success) => {})
.catch((error) => {});
```

```
AwsKafka.consumeTopic(
  topicName,
  (onTopicMessage) => {},
  (onError) => {},
);
```

## Controller
All REST API endpoints are configured in src/orchestration/Controller.js.
The endpoints are defined in an array of [<endpointPath>, <httpMethod>, <callback>]

## State Management
The state of the application is managed by Store.js in src/statemanagement.
  - easily read with Store.getState()
  - updated with Store.setState((currentState) => newState)

## LoggerUtils
LoggerUtils located in src/utils, controls log levels based on the whether the environment is set to testing, development, or production. It features a publisher subscriber setup to easily connect with CloudWatch logs and other monitoring utilities.