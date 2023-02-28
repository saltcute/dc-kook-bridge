import { Card } from "kasumi.js";
import { MessageType } from "kasumi.js/dist/type";
import { client, logger } from "../../init/discord";
import { client as kook } from '../../init/kook';
import { getConnectedChannel } from "../common";

import './connect';
import './disconnect';

client.on('messageCreate', async (message) => {
    if (message.author.id == client.user?.id) return;
    // console.log(message.content);
    let channelId: string | undefined;
    if (channelId = getConnectedChannel.discord(message.channelId)) {
        console.dir(message, { depth: null });
        if (message.content) kook.API.message.create(MessageType.MarkdownMessage, channelId, message
            .content
            .replace(/(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]/gm, '')
            .replaceAll('``````', '```\n```')
            .replace(/([^\n])```/gm, '$1\n```')
            .replace(/([^\\]|)\*/gm, '$1\\*')
            .replace(/__([\S]+?)__/gm, '(ins)$1(ins)')
            .replace(/\|\|([\S]+?)\|\|/gm, '(spl)$1(spl)')
            .replace(/_([\S]+?)_/gm, '*$1*')
        );
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
        if (flg) kook.API.message.create(MessageType.CardMessage, channelId, JSON.stringify([card.toObject()])).catch((e) => {
            console.dir(card.toObject(), { depth: null });
            logger.warn('Send message failed');
            logger.warn(e);
        })
    }
})