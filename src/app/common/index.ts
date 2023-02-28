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

class Connection<T, K> {
    name: string;
    d2k: Storage<T, K>;
    k2d: Storage<T, K>;
    constructor(name: string) {
        this.name = name;
        this.d2k = new Storage<T, K>(`${name}.d2k`).save();
        this.k2d = new Storage<T, K>(`${name}.k2d`).save();
    }
    isRegistered = {
        kook: (keyword: T) => {
            return this.k2d.keys().includes(keyword);
        },
        discord: (keyword: T) => {
            return this.d2k.keys().includes(keyword);
        }
    }
    getConnected = {
        kook: (keyword: T) => {
            return this.k2d.get(keyword);
        },
        discord: (keyword: T) => {
            return this.d2k.get(keyword);
        }
    }
}

class Channel extends Connection<string, string> {
    connect(kook: string, discord: string) {
        this.k2d.set(kook, discord);
        this.d2k.set(discord, kook);
    }
    disconnect = {
        kook: (keyword: string) => {
            let discord = this.k2d.get(keyword);
            if (discord) this.d2k.delete(discord);
            this.k2d.delete(keyword);
        },
        discord: (keyword: string) => {
            let kook = this.d2k.get(keyword);
            if (kook) this.k2d.delete(kook);
            this.d2k.delete(keyword);
        }
    }
}

class Message extends Connection<string, { msg: string, channel: string }> {
    connect(kook: { msg: string, channel: string }, discord: { msg: string, channel: string }) {
        this.k2d.set(kook.msg, discord);
        this.d2k.set(discord.msg, kook);
    }
    disconnect = {
        kook: (keyword: string) => {
            let discord = this.k2d.get(keyword);
            if (discord) this.d2k.delete(discord.msg);
            this.k2d.delete(keyword);
        },
        discord: (keyword: string) => {
            let kook = this.d2k.get(keyword);
            if (kook) this.k2d.delete(kook.msg);
            this.d2k.delete(keyword);
        }
    }
}

export const channel = new Channel('channel')
export const message = new Message('message');