import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

class UrlInhibitor extends Inhibitor {
    pattern: RegExp;
    constructor() {
        super('url', { reason: 'message contained link' });
        this.pattern = /http/i;
    }

    exec(message: Message): boolean {
        return this.pattern.test(message.cleanContent);
    }
}

module.exports = UrlInhibitor;