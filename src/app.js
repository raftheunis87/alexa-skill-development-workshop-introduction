const Alexa = require('alexa-sdk');

const states = {
    STARTMODE: '_STARTMODE',
    HELLOWORLDMODE: '_HELLOWORLDMODE',
};

let speech = '';

module.exports.newSessionHandlers = {
    NewSession() {
        if (Object.keys(this.attributes).length === 0) {
            this.attributes.helloWorldCount = 0;
        }
        this.handler.state = states.STARTMODE;
        speech = 'Welcome to this introduction skill for Alexa. Would you like me to say Hello World to you?';
        this.emit(':ask', speech, speech);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    SessionEndedRequest() {
        this.emit(':tell', 'Goodbye!');
    }
};

module.exports.startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    NewSession() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    HelloWorldIntent() {
        this.emit('HelloWorld', () => {
            speech = 'Hello world! Would you like me to say Hello World again?';
            this.emit(':ask', speech, speech);
        });
    },
    'AMAZON.HelpIntent': function () {
        speech = 'I can say hello world to you! Do you want me to do it?';
        this.emit(':ask', speech, speech);
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = states.HELLOWORLDMODE;
        speech = 'Are you really sure you want to hear this boring Hello World example again?';
        this.emit(':ask', speech, speech);
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    SessionEndedRequest() {
        this.emit(':tell', 'Goodbye!');
    },
    Unhandled() {
        speech = 'Say yes to continue, or no to end.';
        this.emit(':ask', speech, speech);
    }
});

module.exports.helloWorldModeHandlers = Alexa.CreateStateHandler(states.HELLOWORLDMODE, {
    NewSession() {
        this.handler.state = '';
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.YesIntent': function () {
        this.emit('HelloWorld', () => {
            speech = `Hello world! You already made me say this ${this.attributes.helloWorldCount} times. Would you like me to say Hello World again?`;
            this.emit(':ask', speech, speech);
        });
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    SessionEndedRequest() {
        this.emit(':tell', 'Goodbye!');
    },
    Unhandled() {
        speech = 'Say yes to continue, or no to end.';
        this.emit(':ask', speech, speech);
    }
});

module.exports.generalHandlers = {
    HelloWorld(callback) {
        this.handler.state = states.STARTMODE;
        this.attributes.helloWorldCount++;
        callback();
    }
};
