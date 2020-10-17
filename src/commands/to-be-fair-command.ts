import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class ToBeFairCommand extends Command {
    constructor() {
        super('tobefair', {
            regex: /\b(to be fair)\b/im,
            category: 'random'
        });
    }

    exec(message: Message, args: any) : any {
        if (Math.random() > 0.5) return;
        
        message.channel.send("🎵🎶 To be fair! 🎵🎶");
    }
}

module.exports = ToBeFairCommand;