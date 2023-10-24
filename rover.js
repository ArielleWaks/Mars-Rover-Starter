const Command = require('./command.js');
const Message = require('./message.js');

class Rover {
   
   constructor (position) {
      this.position = position;
   }

   mode = 'NORMAL';
   generatorWatts = 110;

   receiveMessage(message) {
      const results = message.commands.map((command) => {
         if (command.commandType === 'MOVE') {
            if (this.mode === 'NORMAL') {
               this.position = command.value;
               return { 'completed': true };
            } else if (this.mode === 'LOW_POWER') {
               return { 'completed': false };
            };
         } else if (command.commandType === 'STATUS_CHECK') {
            return {
               'completed': true,
               'roverStatus': {
                  'mode': this.mode, 
                  'generatorWatts': this.generatorWatts, 
                  'position': this.position
               }
            };
         } else if (command.commandType === 'MODE_CHANGE') {
            this.mode = command.value;
            return { 'completed': true };
         } else {
            return { 'completed': false, 'error': "unknown commandType: " + command.commandType };
         }
      })

      return { 'message' : message.name, 'results' : results };
   }

}

// let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
// let message = new Message('Test message with two commands', commands);
// let rover = new Rover(98382);
// console.log(JSON.stringify(rover.receiveMessage(message), null, "  "));

module.exports = Rover;