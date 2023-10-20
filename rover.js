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
      let resultArray = [];
      let resultObject = {};
      let completed = true;
      // let mode = this.mode;
      // let generatorWatts = this.generatorWatts;
      for (let i=0; i < message.commands.length; i++) {
         if (message.commands[i].commandType === 'MOVE') {
            if (this.mode === 'NORMAL') {
               this.position = message.commands[i].value;
               completed = true;
            } else if (this.mode === 'LOW_POWER') {
               completed = false;
            };
            resultObject = {
               'completed': completed
            };
            resultArray.push(resultObject);
            
         } 
         if (message.commands[i].commandType === 'STATUS_CHECK') {
            resultObject = {
               'completed': completed,
               'roverStatus': {
                  'mode': this.mode, 
                  'generatorWatts': this.generatorWatts, 
                  'position': this.position
               }
            };
            resultArray.push(resultObject);

         } 
         if (message.commands[i].commandType === 'MODE_CHANGE') {
            this.mode = message.commands[i].value;
            completed = true;
            resultObject = {
               'completed': completed
            };
            resultArray.push(resultObject)
         };
      }
      let output = {
         'message' : message.name,
         'results' : resultArray
      };
      return output;
   }
}

let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
let message = new Message('Test message with two commands', commands);
let rover = new Rover(98382);
console.log(JSON.stringify(rover.receiveMessage(message), null, "  "));

module.exports = Rover;