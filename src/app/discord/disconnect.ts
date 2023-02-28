import { client } from '../../init/discord';
import { channel } from '../common';

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'disconnect') {
        channel.disconnect.discord(interaction.channelId);
        await interaction.reply("Disconnected!");
    }
})