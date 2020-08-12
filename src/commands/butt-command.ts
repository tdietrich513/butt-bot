import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stringify } from 'querystring';

class ButtCommand extends Command {
    triggerWords: Map<string, number> = new Map([
        ["big", .2],
        ["small", .2],
        ["great", .2],
        ["good", .18],
        ["bad", .18],
        ["terrible", .2],
        ["fancy", .2],
        ["plain", .2],
        ["many", .15],
        ["few", .15],
        ["my", .1],
        ["your", .1],
        ["their", .1],
        ["his", .1],
        ["her", .1],
        ["this", .075],
        ["the", .05],
        ["a", .05]
    ]);

    thanks: Array<string> = [
        "Thank you %n, I do my best!",
        "It's always nice to be appreciated, %n.",
        "%n enjoys my work!",
        "<_<",
        ">_>",
        "lol",
        "I like you too, %n.",
        "🤣",
        "💩"
    ]

    groupPattern: RegExp;

    constructor() {
        super('butts', {
            category: 'random'
        });

        let words = [].concat.apply([], Array.from(this.triggerWords.keys()))
        const triggerRx = new RegExp(`\\b(${ words.join('|') })\\s(\\S{2,})\\b`, 'ig');
        console.log(`Compiled Rx: ${triggerRx.source}`);
        this.regex = triggerRx;
        this.groupPattern = triggerRx;
    }

    exec(message: Message, args: any) : any {
        const text = message.cleanContent;
        // ignore long messages.
        if (text.length > 120) return;

        // extract words from message.
        const allOptions = text.matchAll(this.groupPattern);

        let sentOne = false;

        while (!sentOne)
        {
            const cur = allOptions.next();
            if (cur.done) return;

            const [fullMatch, leading, word] = cur.value;

            // don't try to replace butt with butt.
            if (word.includes('utt')) continue;
    
            // check random against trigger word probability.
            const chance = this.triggerWords.get(leading.toLowerCase());
            const roll = Math.random();
            console.log(`[r:${roll.toFixed(2)} c:${chance}] "${leading} ${word}" in "${text}"`);
            if (roll > chance) continue;

            sentOne = true;
    
            // Pick appropriate butt.
            let butt =  word.endsWith("'s") ? "butt's" 
                        : word.endsWith('s') ? 'butts' 
                        : 'butt';
            if (word[0].toUpperCase() === word[0]) butt = butt.replace('b', 'B');
    
            const wordRx = new RegExp(word, 'gi');
            const response = text.replace(wordRx, butt);
            message.channel.send(response)
                .then(m => m.awaitReactions(() => true, { max: 1, time: 45000})
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
}

module.exports = ButtCommand;
