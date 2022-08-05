// Libraries
import AwsKafka from "../awskafka/AwsKafka.js";
import ApplicationConfig from "../resources/ApplicationConfig.json";
import cors from "cors";
import express from "express";
import LoggerUtils from "../utils/LoggerUtils.js";
import Store from "../statemanagement/Store.js";
import { WebSocketServer } from "./WebSocket.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// Constants - Local
const ENDPOINT_LENGTH = 3;

const ENDPOINTS = {
  consume: String("/consume"),
  environment: String("/environment"),
  health: String("/health"),
  kafka: String("/kafka"),
  publish: String("/publish"),
  status: String("/status"),
  topics: String("/topics"),
};

const HTTP_CODES = {
  okay: 200,
  badRequest: 400,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
};

const HTTP_METHODS = {
  delete: "DELETE",
  get: "GET",
  post: "POST",
  put: "PUT"
};

class Controller {
  static endpoints = [
    // path                     // method            // callback
    [ENDPOINTS.consume,         HTTP_METHODS.post,   (request, response) => this.handleCreateConsumer(request, response)],
    [ENDPOINTS.environment,     HTTP_METHODS.get,    (request, response) => this.handleEnvironmentCheck(request, response)],
    [ENDPOINTS.health,          HTTP_METHODS.get,    (request, response) => this.handleHealthCheck(request, response)],
    [ENDPOINTS.kafka,           HTTP_METHODS.get,    (request, response) => this.handleGetKafkaClusterInformation(request, response)],
    [ENDPOINTS.publish,         HTTP_METHODS.post,   (request, response) => this.handlePublishToTopic(request, response)],
    [ENDPOINTS.status,          HTTP_METHODS.get,    (request, response) => this.handleStatusCheck(request, response)],
    [ENDPOINTS.topics,          HTTP_METHODS.delete, (request, response) => this.handleDeleteTopic(request, response)],
    [ENDPOINTS.topics,          HTTP_METHODS.get,    (request, response) => this.handleGetTopics(request, response)],
    [ENDPOINTS.topics,          HTTP_METHODS.post,   (request, response) => this.handleCreateTopic(request, response)],
  ];
  static webSocket = new WebSocketServer(Number(ApplicationConfig.webSocketPort));

  static initializeEndpoints() {
    const { endpoints, environment } = Store.getState();
    app.listen(environment.serverPort, () => {
      for(const i in Controller.endpoints) {
        if(Controller.endpoints[i] &&
          Controller.endpoints[i].length &&
          Controller.endpoints[i].length === ENDPOINT_LENGTH
        ) {
          Controller.handleEndpointInitialization(Controller.endpoints[i]);
        }
        else {
          LoggerUtils.error(`[INVALID ENDPOINT]: "${Controller.endpoints[i]}" is not a valid endpoint format.`);
        }
      }
      LoggerUtils.debug(`Established endpoints:\n${endpoints.join("\n")}`);
    });
  }

  static handleEndpointInitialization(endpointConfig) {
    const { endpoints } = Store.getState();
    const [path, method, callback] = endpointConfig;
    switch(method) {
      case HTTP_METHODS.get:
        app.get(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.post:
        app.post(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.put:
        app.put(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.delete:
        app.delete(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      default:
        LoggerUtils.warn(`"${method}" is not recognized as a valid HTTP Method for the endpoint: ${path}`);
    }
  }

  /*====================
  Application Endpoints
  ====================*/
  static handleEnvironmentCheck(request, response) {
    LoggerUtils.debug("Called environment check");
    const { environment } = Store.getState();
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(environment));
  }

  static handleHealthCheck(request, response) {
    LoggerUtils.debug("Called health check");
    const { health } = Store.getState();
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(health));
  }

  static handleStatusCheck(request, response) {
    LoggerUtils.debug("Called status check");
    const { status } = Store.getState();
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(status));
  }

  /*====================
  Cors
  ====================*/
  static setCors(response) {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "DELETE, GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");
  }

  /*====================
  Kafka Endpoints
  ====================*/
  static handleCreateConsumer(request, response) {
    LoggerUtils.debug("Called create consumer");

    const fromBeginning = request.body.fromBeginning;
    const topicName = request.body.topicName;
    if(!topicName) {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send("topicName cannot be empty.");
      return;
    }

    AwsKafka.createConsumer(
      topicName, 
      fromBeginning,
      topicData => {
        Controller.webSocket.publish(`[${topicName}]: ${String(topicData.message.value)}`);
      }
    )
    .then(() => {
      Controller.setCors(response);
      response.status(HTTP_CODES.okay)
      .send();
    })
    .catch((error) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send(error);
    });
  }

  static handleCreateTopic(request, response) {
    LoggerUtils.debug("Called create topic");

    const topicName = request.body.topicName;
    if(!topicName) {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send("topicName cannot be empty.");
      return;
    }

    AwsKafka.createTopic(topicName)
    .then((topicMessage) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.okay)
      .send(topicMessage);
    })
    .catch((error) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send(error);
    });
  }

  static handleDeleteTopic(request, response) {
    LoggerUtils.debug("Called delete topic");

    const topicName = request.body.topicName;
    if(!topicName) {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send("topicName cannot be empty.");
      return;
    }

    AwsKafka.deleteTopic(topicName)
    .then(() => {
      Controller.setCors(response);
      response.status(HTTP_CODES.okay)
      .send();
    })
    .catch((error) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send(error);
    });
  }

  static handleGetKafkaClusterInformation(request, response) {
    LoggerUtils.debug("Called get Kafka cluster information");
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(AwsKafka.getKafkaClusterInformation()));
  }

  static handleGetTopics(request, response) {
    LoggerUtils.debug("Called get topics list");
    AwsKafka.getTopics()
    .then((topics) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.okay)
      .send(topics)
    })
    .catch((error) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.internalServerError)
      .send(error);
    });
  }

  static handlePublishToTopic(request, response) {
    LoggerUtils.debug("Called publish to topic");

    const topicData = request.body.topicData;
    if(!topicData) {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send("topicData cannot be empty.");
      return;
    }

    const topicName = request.body.topicName;
    if(!topicName) {
      Controller.setCors(response);
      response.status(HTTP_CODES.badRequest)
      .send("topicName cannot be empty.");
      return;
    }

    AwsKafka.publishToTopic(topicName, topicData)
    .then((publishMessage) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.okay)
      .send(publishMessage)
    })
    .catch((error) => {
      Controller.setCors(response);
      response.status(HTTP_CODES.internalServerError)
      .send(error);
    });
  }
}
export default Controller;
