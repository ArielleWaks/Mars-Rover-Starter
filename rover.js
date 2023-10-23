const Command = require('./command.js');
const Message = require('./message.js');

class Rover {
   // Write code here!
   
   constructor (position) {
      this.position = position;
   }

   mode = 'NORMAL';
   generatorWatts = 110;

   receiveMessage(message) {
      let completed = true;
      const results = message.commands.map((command) => {
         if (command.commandType === 'MOVE') {
            if (this.mode === 'NORMAL') {
               this.position = command.value;
               completed = true;
            } else if (this.mode === 'LOW_POWER') {
               completed = false;
            };
            return { 'completed': completed };
         } 
         if (command.commandType === 'STATUS_CHECK') {
            return {
               'completed': completed,
               'roverStatus': {
                  'mode': this.mode, 
                  'generatorWatts': this.generatorWatts, 
                  'position': this.position
               }
            };
         } 
         if (command.commandType === 'MODE_CHANGE') {
            this.mode = command.value;
            completed = true;
            return { 'completed': completed };
         };
      })

      let output = {
         'message' : message.name,
         'results' : results
      };
      return output;
   }

}

let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
let message = new Message('Test message with two commands', commands);
let rover = new Rover(98382);
console.log(JSON.stringify(rover.receiveMessage(message), null, "  "));

module.exports = Rover;