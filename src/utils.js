import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function DiscordRequest(endpoint, options) {
  const url = 'https://discord.com/api/v10/' + endpoint;

  if (options.body) options.body = JSON.stringify(options.body);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'RPS-Discord-App',
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }

  return res;
}

export async function InstallCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export async function getProfile(id) {
  return prisma.user.findFirst({
    where: { id },
  });
}

export function formatProfile(user, profile) {
  const block = (str) => `\`${str}\``;
  const format = (num) => num.toLocaleString();

  const fields = {
    Wins: profile.wins,
    Loses: profile.loses,
    Ties: profile.ties,
  };

  let description = '';

  for (const [name, value] of Object.entries(fields)) {
    description += `${block(name + ':')} ${format(value)}\n`;
  }

  return {
    embeds: [
      {
        title: `${user.global_name ?? user.username}'s Profile`,
        description,
        timestamp: new Date().toISOString(),
        color: 0xDAD4B7,
      },
    ],
  };
}
