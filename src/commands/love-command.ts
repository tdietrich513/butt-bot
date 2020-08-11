import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class LoveCommand extends Command {
    constructor() {
        super('love', {
            regex: /\b(butt|butts)\b/im,
            category: 'random'
        });
    }

    exec(message: Message, args: any) : any {
        if (Math.random() < 0.25) return;
        
        message.react("❤️")
            .catch(() => console.error("Failed to react"));
    }
}

module.exports = LoveCommand;