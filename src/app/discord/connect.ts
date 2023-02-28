import { client } from '../../init/discord';
import { client as kook } from '../../init/kook';
import { connect } from '../common';

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'connect') {
        let channelId = interaction.options.getString('channel', true);
        if (/^\d{16}$/.test(channelId) && await kook.API.channel.view(channelId).catch(e => false)) {
            await connect(channelId, interaction.channelId);
            await interaction.reply(`Connected this Discord channel to KOOK channel ${channelId}`);
        } else {
            await interaction.reply("Not a valid channel ID!");
        }
    }
})