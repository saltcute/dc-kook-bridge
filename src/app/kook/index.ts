import { client } from '../../init/kook';
import { rest } from '../../init/discord';
import { getConnectedChannel } from '../common';
import { Routes } from 'discord.js';
import { connect } from './connect';
import { disconnect } from './disconnect';

client.message.on('allTextMessages', (event) => {
    let channelId: string | undefined;
    if (channelId = getConnectedChannel.kook(event.channelId)) {
        rest.post(Routes.channelMessages(channelId), {
            body: {
                content: /*event.content.startsWith('!')*/ true ? event.content : `${event.author.username} says:\n\`\`\`plain\n${event.content}\n\`\`\``
            }
        }).catch((e) => {
            client.logger.warn('Send message failed');
            client.logger.warn(e);
        })
    }
})

client.plugin.load(connect, disconnect);