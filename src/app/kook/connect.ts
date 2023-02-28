import { Routes } from "discord.js";
import { BaseCommand, BaseSession, CommandFunction } from "kasumi.js";
import { rest as discord } from "../../init/discord";
import { channel } from "../common";

class Connect extends BaseCommand {
    name = 'connect';
    description = '连接频道';

    func: CommandFunction<BaseSession, any> = async (session) => {
        if (session.args.length) {
            let channelId = session.args[0];
            if (await discord.get(Routes.channel(channelId)).catch(e => false)) {
                channel.connect(session.channelId, channelId);
                return session.reply('连接成功!');
            } else return session.reply('频道不存在！');
        } else return session.reply('请输入一个频道');
    }
}

export const connect = new Connect()