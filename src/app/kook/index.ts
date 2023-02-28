import { client } from '../../init/kook';
import { rest, client as discord, logger } from '../../init/discord';
import { channel, message as msg } from '../common';
import { Routes } from 'discord.js';
import { connect } from './connect';
import { disconnect } from './disconnect';
import config from '../../config/config';

client.message.on('systemMessages', (event) => {
    // console.log(event);
    if (event.rawEvent.extra.type == 'deleted_message') {
        let messageId;
        if (messageId = msg.getConnected.kook(event.rawEvent.extra.body.msg_id)) {
            rest.delete(Routes.channelMessage(messageId.channel, messageId.msg)).catch((e) => {
                // logger.warn(e);
            })
            msg.disconnect.kook(messageId.msg);
        }
        // logger.info(messageId);
    }
})

client.message.on('allTextMessages', (event) => {
    if (config.kook.allowedUserList.length && !(config.kook.allowedUserList as Array<string>).includes(event.authorId)) return;
    let channelId: string | undefined;
    if ((channelId = channel.getConnected.kook(event.channelId)) && event.content.startsWith('!')) {
        rest.post(Routes.channelMessages(channelId), {
            body: {
                content: event.content
            }
        }).then((res) => {
            msg.connect({
                msg: event.messageId,
                channel: event.channelId
            }, {
                msg: (res as any).id,
                channel: (res as any).channel_id
            });
        }).catch((e) => {
            client.logger.warn('Send message failed');
            client.logger.warn(e);
        })
    }
})

client.plugin.load(connect, disconnect);