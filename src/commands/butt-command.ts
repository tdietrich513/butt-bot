import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class ButtCommand extends Command {
    triggerWords: Array<string> = [
        "big",
        "small",
        "many",
        "few",
        "my",
        "your",
        "their",
        "his",
        "her",
        "this",
        "the",
        "a"
    ];

    thanks: Array<string> = [
        "Thank you %n, I do my best!",
        "It's always nice to be appreciated, %n.",
        "%n enjoys my work!",
        "<_<",
        ">_>",
        "lol",
        "I like you too, %n.",
        "🤣"
    ]

    groupPattern: RegExp;

    constructor() {
        super('butts', {
            category: 'random'
        });

        const triggerRx = new RegExp(`\\b(${ this.triggerWords.join('|') })\\s(\\S{2,})\\b`, 'i');
        console.log(`CompiledRx: ${triggerRx.source}`);
        this.regex = triggerRx;
        this.groupPattern = triggerRx;
    }

    exec(message: Message, args: any) : any {
        const text = message.cleanContent;
        // ignore long messages.
        if (text.length > 120) return;

        // extract words from message.
        const [fullMatch, leading, word] = text.match(this.groupPattern);

        // Don't try to replace butt with butt.
        if (word.includes('utt')) return;

        // Only a small chance.
        if (Math.random() > 0.075) return;

        // Pick appropriate butt.
        const butt =  word.endsWith("'s") ? "butt's" 
                    : word.endsWith('s') ? 'butts' 
                    : 'butt';

        const wordRx = new RegExp(word, 'gi');
        const response = text.replace(wordRx, butt);
        message.channel.send(response)
            .then(m => m.awaitReactions(() => true, { max: 1, time: 20000})
                .then((collected => {
                    if (collected.size == 0) return;

                    const reaction = collected.first();
                    const user = reaction.users.cache.first();
                    const userNick = message.guild.member(user).displayName;

                    const thankNum = Math.floor(Math.random() * this.thanks.length);
                    const thankMsg = this.thanks[thankNum].replace('%n', userNick);
                    
                    message.channel.send(thankMsg);
                })).catch(() => console.error("Failed to check reactions"))
            ).catch(() => console.error("Failed to send butt joke"));            
    }
}

module.exports = ButtCommand;