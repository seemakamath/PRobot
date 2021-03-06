const actions = require('./actions');
const Payload = require('./payload');

class Dispatcher {
  constructor(github, event) {
    this.github = github;
    this.event = event;
  }

  call(config) {
    // Get behaviors for the event
    const behaviors = config.behaviorsFor(this.event);

    // Handle all behaviors
    return Promise.all(behaviors.map(behavior => this.handle(behavior)));
  }

  handle(behavior) {
    return Promise.all(Object.keys(behavior.then).map(actionName => {
      const action = actions[actionName];
      if (!action) {
        throw new Error('Unknown action: ' + actionName);
      }
      return action(this.github, new Payload(this.event.payload), behavior.then[actionName]);
    }));
  }
}

module.exports = Dispatcher;
