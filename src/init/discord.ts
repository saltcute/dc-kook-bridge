import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import config from '../config/config';
import Logger from 'bunyan';

export const logger = Logger.createLogger({
    name: 'discord',
    level: Logger.INFO,
    stream: process.stdout
})

const commands = [
    {
        name: 'connect',
        name_localizations: {
            'zh-CN': '连接',
            'zh-TW': '連結'
        },
        description: 'Connect current channel to Bridgee',
        description_localizations: {
            'zh-CN': '将当前频道与 Bridgee 连接',
            'zh-TW': '將當前頻道連結至 Bridgee'
        },
        options: [
            {
                type: 3,
                name: 'channel',
                name_localizations: {
                    'zh-CN': '频道',
                    'zh-TW': '頻道'
                },
                description: 'The KOOK channel that needs to be linked to this Discord channel',
                description_localizations: {
                    'zh-CN': '需要连接到的 KOOK 频道',
                    'zh-TW': '需要連結到的 KOOK 頻道'
                },
                required: true
            }
        ]
    },
    {
        name: 'disconnect',
        name_localizations: {
            'zh-CN': '解除连接',
            'zh-TW': '解除連結'
        },
        description: 'Connect current channel to Bridgee',
        description_localizations: {
            'zh-CN': '将当前频道与 Bridgee 解除连接',
            'zh-TW': '解除當前頻道與 Bridgee 的連結'
        }
    }
];

export const rest = new REST({ version: '10' }).setToken(config.discordToken);
(async () => {
    await rest.put(Routes.applicationCommands(config.discordApplicationId), { body: commands }).catch((e) => {
        logger.warn('Failed to update command list');
        logger.warn(e);
    })
})()

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}`);
})
