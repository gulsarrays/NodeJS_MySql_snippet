const EventEmitter = require('events');

// const emitter = new EventEmitter();

class ActorUpdateByEventClass extends EventEmitter {
  updateActor(req, res) {
    // console.log('ActorUpdateByEventClass');
    this.emit('PushEvent', { req, res });
  }
}

module.exports = ActorUpdateByEventClass;
