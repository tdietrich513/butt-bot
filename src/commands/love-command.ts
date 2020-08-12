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
        if (Math.random() > 0.25) return;
        
        if (message.guild.id == "688518824433025035")
            message.react("742895857568972861")
                .catch(() => console.error("Failed to react"));
        else
            message.react("❤️")
                .catch(() => console.error("Failed to react"));
    }
}

module.exports = LoveCommand;