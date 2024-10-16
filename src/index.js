import 'dotenv/config';
import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { getResult, getRPSOptions } from './game.js';
import { DiscordRequest } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;

const activeGames = {};

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async (req, res) => {
    const { id, type, data } = req.body;

    if (type === 1) {
      return res.send({
        type: 1,
      });
    }

    if (type === 2) {
      const { name } = data;

      if (name === 'ping') {
        return res.send({
          type: 4,
          data: {
            content: 'Pong! 🏓',
            flags: 64,
          },
        });
      } else if (name === 'challenge') {
        const context = req.body.context;
        const userId =
          context === 0 ? req.body.member.user.id : req.body.user.id;
        const object = data.options[0].value;

        activeGames[id] = {
          id: userId,
          object,
        };

        return res.send({
          type: 4,
          data: {
            content: `Rock papers scissors game from <@${userId}>`,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    custom_id: `game_${id}`,
                    label: 'Accept',
                    style: 1,
                  },
                ],
              },
            ],
          },
        });
      }
    }

    if (type === 3) {
      const [componentId, gameId] = data.custom_id.split('_');

      if (componentId === 'game') {
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

        res.send({
          type: 4,
          data: {
            content: 'Select your object',
            flags: 64,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 3,
                    custom_id: `select-game_${gameId}`,
                    options: getRPSOptions(),
                  },
                ],
              },
            ],
          },
        });

        await DiscordRequest(endpoint, { method: 'DELETE' });
      } else if (componentId === 'select-game') {
        if (activeGames[gameId]) {
          const context = req.body.context;
          const userId =
            context === 0 ? req.body.member.user.id : req.body.user.id;
          const object = data.values[0];

          const resultStr = getResult(activeGames[gameId], {
            id: userId,
            object,
          });

          delete activeGames[gameId];

          res.send({
            type: 4,
            data: { content: resultStr },
          });
        }
      }
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:3000/`);
});
