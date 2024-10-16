import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { InstallCommands } from './utils.js';

function createChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (const choice of choices) {
    commandChoices.push({
      name: choice.charAt(0).toUpperCase() + choice.slice(1),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

const commands = [
  {
    name: 'ping',
    description: 'Ping!',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
  },
  {
    name: 'challenge',
    description: 'Challenge a game of rock paper scissors',
    type: 1,
    options: [
      {
        name: 'object',
        description: 'Pick your object',
        type: 3,
        required: true,
        choices: createChoices(),
      },
    ],
    integration_types: [0, 1],
    contexts: [0, 2],
  },
];

InstallCommands(process.env.APP_ID, commands);
