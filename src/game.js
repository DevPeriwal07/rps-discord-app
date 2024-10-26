export function getResult(p1, p2) {
  let gameResult;

  if (RPSChoices[p1.object] && RPSChoices[p1.object][p2.object]) {
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.object][p2.object],
    };
  } else if (RPSChoices[p2.object] && RPSChoices[p2.object][p1.object]) {
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.object][p1.object],
    };
  } else {
    gameResult = { win: p1, lose: p2, verb: 'tie' };
  }

  return formatResult(gameResult);
}

function formatResult(result) {
  const { win, lose, verb } = result;

  return verb === 'tie'
    ? `<@${win.id}> and <@${lose.id}> draw with **${win.object}**`
    : `<@${win.id}>'s **${win.object}** ${verb} <@${lose.id}>'s **${lose.object}**`;
}

export function getRPSChoices() {
  return Object.keys(RPSChoices);
}

export function getRPSOptions() {
  const allChoices = getRPSChoices();
  const options = [];

  for (let c of allChoices) {
    options.push({
      label: c.charAt(0).toUpperCase() + c.slice(1),
      value: c.toLowerCase(),
      description: RPSChoices[c].description,
      emoji: {
        name: RPSChoices[c].emoji,
      },
    });
  }

  return options;
}

const RPSChoices = {
  rock: {
    emoji: '🪨',
    description: 'sedimentary, igneous, or perhaps even metamorphic',
    scissors: 'smashes',
  },
  paper: {
    emoji: '📃',
    description: 'versatile and iconic',
    rock: 'covers',
  },
  scissors: {
    emoji: '✂️',
    description: 'careful ! sharp ! edges !!',
    paper: 'cuts',
  },
};
