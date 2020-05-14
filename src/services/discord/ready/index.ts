import { discordGuild } from "../../../utils/values";

export const handleDiscordReady = discordClient => {
  const guild = discordClient.guilds.find(
    g => g.name === discordGuild.guildName
  );
  if (!guild) {
    throw `Could not find guild specified ${discordGuild.guildName}`;
  }

  // get guild
  const discordGuildId = guild.id;

  // get welcome channel
  const discordWelcomeChId = discordClient.guilds
    .get(discordGuildId)
    .channels.find(ch => ch.name === discordGuild.welcomeCh).id;

  // get talimas-feed channel
  const discordTalimasFeedChId = discordClient.guilds
    .get(discordGuildId)
    .channels.find(ch => ch.name === discordGuild.talimasFeedCh).id;

  return { discordGuildId, discordWelcomeChId, discordTalimasFeedChId };
};
