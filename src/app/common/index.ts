import * as fs from 'fs';
import upath from 'upath';

class Storage<T, K> {
    filename: string;
    map!: Map<T, K>;
    constructor(filename: string) {
        this.filename = filename;
        this.load();
        this.autosave();
    }
    delete(key: T): this {
        this.map.delete(key);
        return this;
    }
    set(key: T, value: K): this {
        this.map.set(key, value);
        return this;
    }
    get(key: T): K | undefined {
        return this.map.get(key);
    }
    keys() {
        return Array.from(this.map.keys());
    }
    load() {
        const path = upath.join(__dirname, '..', '..', 'config', 'data');
        if (fs.existsSync(upath.join(path, `${this.filename}.json`))) {
            const data = JSON.parse(fs.readFileSync(upath.join(path, `${this.filename}.json`), { encoding: 'utf-8', flag: 'r' }));
            this.map = new Map<T, K>(Object.entries(data) as any);
        } else this.map = new Map<T, K>();
        return this;
    }
    autosave(interval: number = 30 * 1000) {
        setInterval(() => { this.save() }, interval);
    }
    save() {
        const data = Object.fromEntries(this.map);
        const path = upath.join(__dirname, '..', '..', 'config', 'data');
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(upath.join(path, `${this.filename}.json`), JSON.stringify(data));
        return this;
    }
}

const d2k = new Storage<string, string>("d2k").save();
const k2d = new Storage<string, string>("k2d").save();

export async function connect(kookChannelId: string, discordChannelId: string) {
    k2d.set(kookChannelId, discordChannelId);
    d2k.set(discordChannelId, kookChannelId);
}
export async function disconnect(type: 'kook' | 'discord', channelId: string) {
    if (type == 'kook') {
        let discordChannelId = k2d.get(channelId);
        if (discordChannelId) d2k.delete(discordChannelId);
        k2d.delete(channelId);
    } else {
        let kookChannelId = d2k.get(channelId);
        if (kookChannelId) k2d.delete(kookChannelId);
        d2k.delete(channelId);
    }
}

export const isRegistered = {
    kook(channelId: string) {
        return k2d.keys().includes(channelId);
    },
    discord(channelId: string) {
        return d2k.keys().includes(channelId);
    }
}

export const getConnectedChannel = {
    kook(channelId: string) {
        return k2d.get(channelId);
    },
    discord(channelId: string) {
        return d2k.get(channelId);
    }
}