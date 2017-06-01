const Alexa = require('alexa-sdk');

const WELCOME_MESSAGE = 'Welcome to this introduction skill for Alexa. Would you like me to say Hello World to you?';
const HELP_MESSAGE = 'Would you like me to say Hello World to you?';
const EXIT_SKILL_MESSAGE = 'Thank you for trying out this skill! Goodbye!';

const states = {
    START: '_START',
    HELLOWORLD: '_HELLOWORLD',
};

let speech = '';

module.exports.handlers = {
    LaunchRequest() {
        this.handler.state = states.START;
        this.emitWithState('Start');
    },
    HelloWorldIntent() {
        this.handler.state = states.START;
        this.emitWithState('HelloWorld');
    },
    Unhandled() {
        this.handler.state = states.START;
        this.emitWithState('Start');
    }
};

module.exports.startHandlers = Alexa.CreateStateHandler(states.START, {
    Start() {
        this.emit(':ask', WELCOME_MESSAGE, HELP_MESSAGE);
    },
    'AMAZON.YesIntent': function () {
        this.emit('SayHelloWorld', () => {
            speech = `Hello world! You already made me say this ${this.attributes.helloWorldCount} times. Would you like me to say Hello World again?`;
            this.emit(':ask', speech, speech);       
        });
    },
    HelloWorld() {
         this.emit('SayHelloWorld', () => {
            speech = `Hello world! You already made me say this ${this.attributes.helloWorldCount} times. Would you like me to say Hello World again?`;
            this.emit(':ask', speech, speech);       
        });
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_MESSAGE);
    },
    Unhandled() {
        this.emitWithState('Start');
    }
});

module.exports.generalHandlers = {
    SayHelloWorld(callback) {
        if (Object.keys(this.attributes).length === 0) {
            this.attributes.helloWorldCount = 0;
        }
        this.attributes.helloWorldCount++;
        callback();
    }
};
