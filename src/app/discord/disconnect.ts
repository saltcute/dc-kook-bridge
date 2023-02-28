import { client } from '../../init/discord';
import { disconnect } from '../common';

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'disconnect') {
        await disconnect('discord', interaction.channelId);
        await interaction.reply("Disconnected!");
    }
})