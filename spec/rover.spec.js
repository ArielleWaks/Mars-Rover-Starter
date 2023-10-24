const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');



describe("Rover class", function() {

  test('constructor sets position and default values for mode and generatorWatts', () => {
    let rover = new Rover(98382);
    expect(rover.position).toBe(98382);
    expect(rover.mode).toBe('NORMAL');
    expect(rover.generatorWatts).toBe(110);
  });

  test('response returned by receiveMessage contains the name of the message', () => {
    let message = new Message('Test message with no commands', []);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message)).toHaveProperty('message', message.name);
    expect(rover.receiveMessage(message)).toHaveProperty('message', 'Test message with no commands');
  });


  test('response returned by receiveMessage includes two results if two commands are sent in the message', () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results).toHaveLength(2);

  });


  test('responds correctly to the status check command', () => {
    let command = [new Command('STATUS_CHECK')];
    let message = new Message('Test message with one command', command);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results[0]).toHaveProperty('completed', true);
    expect(rover.receiveMessage(message).results[0]).toHaveProperty('roverStatus');
    expect(rover.receiveMessage(message).results[0]).toHaveProperty('roverStatus.mode');
    expect(rover.receiveMessage(message).results[0]).toHaveProperty('roverStatus.generatorWatts');
    expect(rover.receiveMessage(message).results[0]).toHaveProperty('roverStatus.position');
  });


  test('responds correctly to the mode change command', () => {
    let commands = [ new Command ('MODE_CHANGE', 'LOW_POWER') ];
    let message = new Message('Test message with low power', commands);
    let rover = new Rover(98382);
    rover.receiveMessage(message);
    expect(rover.receiveMessage(message).results).toStrictEqual([{'completed': true}]);
    expect(rover.mode).toBe('LOW_POWER');

  });


  test('responds with a false completed value when attempting to move in LOW_POWER mode', () => {
    let commands = [new Command ('MODE_CHANGE', 'LOW_POWER'), new Command ('MOVE', 12000)];
    let message = new Message('Test message with low power move', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results[1]).toHaveProperty('completed', false);

  });


  test('responds with the position for the move command', () => {
    let commands = [new Command ('MOVE', 12000)];
    let message = new Message ('Test message with move command', commands);
    let rover = new Rover(98382);
    rover.receiveMessage(message);
    expect(rover.position).toBe(12000);

  });


});
