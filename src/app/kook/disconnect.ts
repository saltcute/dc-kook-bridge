import { BaseCommand, BaseSession, CommandFunction } from "kasumi.js";
import { channel } from "../common";

class Disconnect extends BaseCommand {
    name = 'disconnect';
    description = '解除链接';

    func: CommandFunction<BaseSession, any> = async (session) => {
        if (session.args.length) {
            let channelId = session.args[0];
            channel.disconnect.kook(channelId);
            return session.reply('解除成功!');
        }
    }
}

export const disconnect = new Disconnect();