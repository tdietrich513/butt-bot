import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { kMaxLength } from 'buffer';

class ButtCommand extends Command {
    groupPattern: RegExp = /\b(big|small|my|your|their|his|her|this|the|a)\s(\S{2,})\b/i;

    constructor() {
        super('butts', {
            regex: /\b(big|small|my|your|their|his|her|this|the|a)\s(\S{2,})\b/im,
            category: 'random'
        });
    }

    exec(message: Message, args: any) : any {
        const text = message.cleanContent;
        // ignore long messages.
        if (text.length > 120) return;
        const [fullMatch, pronoun, word] = text.match(this.groupPattern);

        const roll = Math.floor(Math.random() * 10);

        // Only a 10% chance.
        if (roll > 0) return;

        const butt = word.endsWith('s') ? 'butts' : 'butt';
        const wordRx = new RegExp(word, 'gi');
        const response = text.replace(wordRx, butt);
        message.channel.send(response)
            .then(m => m.awaitReactions(() => true, { max: 1, time: 15000})
                .then((collected => {
                    if (collected.size == 0) return;

                    const reaction = collected.first();
                    const user = reaction.users.cache.first();
                    const userNick = message.guild.member(user).displayName;
                    
                    message.channel.send(`Thank you ${userNick}, I do my best!`);
                })).catch(() => console.error("Failed to check reactions"))
            ).catch(() => console.error("Failed to send butt joke"));            
    }
}

module.exports = ButtCommand;