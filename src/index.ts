import config from './config/config';
import { client as discord } from './init/discord';
import { client as kook } from './init/kook';

import './app/discord';
import './app/kook';

discord.login(config.discordToken);
kook.connect();