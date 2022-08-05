// Libraries
import { exec } from "child_process";
import UuidUtils from "../../utils/UuidUtils.js";

// Exceptions
import AsyncProcessInvalidArgumentsException from "../exceptions/AsyncProcessInvalidArgumentsException.js";
import AsyncProcessInvalidSubscriberException from "../exceptions/AsyncProcessInvalidSubscriberException.js";

// Constants (Global)
import IgnoredKafkaWarnings from "../IgnoredKafkaWarnings.json";

class AsyncProcess {
  constructor(args, cli, awaitExecution, onExit) {
    this.args = args;
    this.awaitingExecution = awaitExecution || false;
    this.cli = cli;
    this.onExit = onExit;
    this.process = null;
    this.processDataSubscribers = {};
    this.processErrorSubscribers = {};
    this.isAlive = true;

    if (!this.awaitingExecution) {
      this.execute();
    }
    return this;
  }

  getArgs() { return this.args; }
  getAwaitingExecution() { return this.awaitingExecution; }
  getCli() { return this.cli; }
  getProcess() { return this.process; }
  getProcessDataSubscribers() { return this.processDataSubscribers; }
  getProcessErrorSubscribers() { return this.processErrorSubscribers; }
  getIsAlive() { return this.isAlive; }

  execute() {
    if(this.isAlive) {
      this.awaitingExecution = false;
      const args = this.getArgs();
      const cli = this.getCli();
      if (cli) {
        const process = exec((cli), { ...args });
        
        // data
        process.stdout.on("data", (data) => {
          // remove carriage returns and line spacing from data string
          data = data.replaceAll("\r", "").replaceAll("\n", "").trim();

          // ignore empty std message spam
          if(data.length > 0) {
            this.publishToDataSubscribers(data);
          }
        });

        // error
        process.stderr.on("data", (error) => {
          // remove carriage returns and line spacing from error string
          error = error.replaceAll("\r", "").replaceAll("\n", "").trim();

          // ignore warnings and empty std message spam
          if(!IgnoredKafkaWarnings.ignoredWarnings.includes(error) && error.length > 0) {
            this.publishToErrorSubscribers(error);
          }
        });

        // exit
        process.on("exit", () => this.kill());
        this.process = process;
        return process;
      }
      else {
        throw new AsyncProcessInvalidArgumentsException(`
          Command-line-interface (CLI) arguments cannot be empty, null, or undefined.
          Received value: "${cli}".
        `);
      }
    }
  }

  kill() {
    // set status
    this.isAlive = false;
    
    // onExit callback
    if(this.onExit instanceof Function) {
      this.onExit();
    }

    // kill childprocess
    if(this.process) {
      this.process.kill(0);
    }
    this.process = null;
  }

  /*====================
  Publish & Subscribe
  ====================*/
  publishToDataSubscribers(data) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    const subscriberKeys = Object.keys(processDataSubscribers);
    for (const key in subscriberKeys) {
      if (processDataSubscribers[subscriberKeys[key]] instanceof Function) {
        processDataSubscribers[subscriberKeys[key]](data);
      } else {
        this.unsubscribeFromData(subscriberKeys[key]);
      }
    }
  }

  publishToErrorSubscribers(error) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    const subscriberKeys = Object.keys(processErrorSubscribers);
    for (const key in subscriberKeys) {
      if (processErrorSubscribers[subscriberKeys[key]] instanceof Function) {
        processErrorSubscribers[subscriberKeys[key]](error);
      } else {
        this.unsubscribeFromError(subscriberKeys[key]);
      }
    }
  }

  subscribeToData(onLog) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    if (onLog instanceof Function) {
      const key = String(`Async-Process-Data-Subscriber-${UuidUtils.uuid()}`);
      processDataSubscribers[key] = onLog;
    } else {
      throw new AsyncProcessInvalidSubscriberException();
    }
  }

  subscribeToError(onLog) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    if (onLog instanceof Function) {
      const key = String(`Async-Process-Error-Subscriber-${UuidUtils.uuid()}`);
      processErrorSubscribers[key] = onLog;
    } else {
      throw new AsyncProcessInvalidSubscriberException();
    }
  }

  unsubscribeFromData(key) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    if (processDataSubscribers.hasOwnProperty(key)) {
      delete processDataSubscribers[key];
    }
  }

  unsubscribeFromError(key) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    if (processErrorSubscribers.hasOwnProperty(key)) {
      delete processErrorSubscribers[key];
    }
  }
}
export default AsyncProcess;
