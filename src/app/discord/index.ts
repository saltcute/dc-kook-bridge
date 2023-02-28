import config from "../../config/config";
import { Card } from "kasumi.js";
import { MessageType } from "kasumi.js/dist/type";
import { client, logger } from "../../init/discord";
import { client as kook } from '../../init/kook';
import { channel, message as msg } from "../common";

import './connect';
import './disconnect';

client.on('messageDelete', async (message) => {
    let messageId;
    if (messageId = msg.getConnected.discord(message.id)) {
        // console.log(messageId.msg);
        kook.API.message.delete(messageId.msg).catch((e) => {
            // kook.logger.warn(e);
        })
        msg.disconnect.discord(messageId.msg);
    }
    // kook.logger.info(messageId);
})

client.on('messageCreate', async (message) => {
    if (config.discord.allowedUserList.length && !(config.discord.allowedUserList as Array<string>).includes(message.author.id)) return;

    if (message.author.id == client.user?.id) return;
    // console.log(message.content);
    let channelId: string | undefined;
    if (channelId = channel.getConnected.discord(message.channelId)) {
        // console.dir(message, { depth: null });
        if (message.content) kook.API.message.create(MessageType.MarkdownMessage, channelId, message
            .content
            .replace(/(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]/gm, '')
            .replaceAll('``````', '```\n```')
            .replace(/([^\n])```/gm, '$1\n```')
            .replace(/([^\\]|)\*/gm, '$1\\*')
            .replace(/__([\S]+?)__/gm, '(ins)$1(ins)')
            .replace(/\|\|([\S]+?)\|\|/gm, '(spl)$1(spl)')
            .replace(/_([\S]+?)_/gm, '*$1*')
        ).then((res) => {
            if (channelId)
                msg.connect({ msg: res.msg_id, channel: channelId }, { msg: message.id, channel: message.channelId });
        }).catch((e) => {
            // console.dir(card.toObject(), { depth: null });
            logger.warn('Send message failed');
            logger.warn(e);
        })
        const card = new Card()
            .setTheme('info')
            .setSize('lg')
        let flg = false;
        for (const embed of message.embeds) {
            if (embed.title) card.addTitle(embed.title);
            if (embed.data.fields) {
                let string = "";
                for (const filed of embed.data.fields) {
                    flg = true;
                    let addition = `**(font)${filed.name}(font)[success]**\n` +
                        filed.value
                            .replace(/([^\\]|)\*/gm, '$1\\*')
                            .replace(/__([\S]+?)__/gm, '(ins)$1(ins)')
                            .replace(/\|\|([\S]+?)\|\|/gm, '(spl)$1(spl)')
                            .replace(/_([\S]+?)_/gm, '*$1*') + '\n';
                    let tempString = string + addition;
                    if (tempString.length > 5000) {
                        card.addText(string);
                        string = addition;
                    } else string = tempString;
                }
                if (string) card.addText(string);
            }
        }
        // console.log(channelId);
        if (flg) await kook.API.message.create(MessageType.CardMessage, channelId, JSON.stringify([card.toObject()]))
            .then((res) => {
                if (channelId)
                    msg.connect({ msg: res.msg_id, channel: channelId }, { msg: message.id, channel: message.channelId });
            })
            .catch((e) => {
                // console.dir(card.toObject(), { depth: null });
                logger.warn('Send message failed');
                logger.warn(e);
            })
    }
})