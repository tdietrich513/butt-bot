import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Lexicon, RuleSet, BrillPOSTagger, Tokenizer, RegexpTokenizer } from 'natural';

class ButtCommand extends Command {
    thanks: Array<string> = [
        "Thank you %n, I do my best!",
        "It's always nice to be appreciated, %n.",
        "%n enjoys my work!",
        "0_0",
        "T.T",
        "^_^",
        "<_<",
        ">_>",
        "lol",
        "o7",
        "I like you too, %n.",
        "🤣",
        "💩"
    ]

    channelLastPost: Map<string, Date> = new Map();
    messageBuffer: Map<string, { taggedWords: { token: string, tag:string }[]}> = new Map()
    tagger: BrillPOSTagger;
    tokenizer: Tokenizer;

    constructor() {
        super('butts', {
            category: 'random'
        });

        const lexicon = new Lexicon('EN', 'NN');
        const ruleSet = new RuleSet('EN');
        this.tagger  = new BrillPOSTagger(lexicon, ruleSet);
        this.tokenizer = new RegexpTokenizer({
            pattern: /[^A-Za-zА-Яа-я0-9_\']+/g
        });
    }

    condition(message: Message): boolean {
        let text = message.cleanContent;
        let forced = false;

        if (text.startsWith("!!butt ")) {
            forced = true;
            text = text.slice(7);
        }

        // ignore long messages.
        if (!forced && text.length > 120) return false;

        // reduce probabilities of comment in the time after a comment.
        if(!this.channelLastPost.has(message.channel.id)) this.channelLastPost.set(message.channel.id, new Date());
        const lastCommentTime = this.channelLastPost.get(message.channel.id);
        const minSince = (new Date().getTime() - lastCommentTime.getTime()) / 60000;
        const spamAdjuster = (minSince < 30) ? minSince / 30 : 1;

        // check random against trigger probability.
        const chance = .05 * spamAdjuster;
        const roll = Math.random();
        if (!forced && roll > chance) return false;

        // NLP time
        const tokens = this.tokenizer.tokenize(text);
        // Don't send one word replies.
	    if (!forced && tokens.length === 1) return false;

        const output = JSON.stringify(this.tagger.tag(tokens));
        const sentence: { taggedWords: { token: string, tag:string }[]} = JSON.parse(output);

        // Make sure there are some nouns.
        if (!sentence.taggedWords.some(t => t.tag.startsWith("NN"))) return false;

        this.messageBuffer.set(message.id, sentence);
        this.channelLastPost.set(message.channel.id, new Date());
        return true;
    }

    exec(message: Message, args: any) : any {
        let text = message.cleanContent;

        if (text.startsWith("!!butt ")) {
            text = text.slice(7);
        }

        const sentence = this.messageBuffer.get(message.id);
        this.messageBuffer.delete(message.id);


        // only attempt to replace nouns.
        const nouns = sentence.taggedWords.filter(w => w && w.tag.startsWith("NN") && w.token.length > 1);

        // select random noun;
        const word = nouns[Math.floor(Math.random() * nouns.length)];

        console.info(`Message:"${text}"\n  Nouns: ${JSON.stringify(nouns)}\n  Choice: ${word.token}`);

        // Pick appropriate butt.
        let butt: string;
        switch(word.tag){
            case "NN": {
                butt = "butt";
                break;
            }
            case "NNP": {
                butt = "Butt";
                break;
            }
            case "NNPS": {
                butt = "Butts";
                break;
            }
            case "NNS": {
                butt = "butts";
                break;
            }
            default: {
                console.log(`Unknown token: ${word.tag}`);
                butt = "butt";
                break;
            }
        }
     
        const wordRx = new RegExp(`\\b${word.token}\\b`, 'gi');
        const response = text.replace(wordRx, butt);
        message.channel.startTyping();
        setTimeout(() => {
            message.channel.stopTyping();
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
            }, Math.floor(response.length /.012));
    }
    
}

module.exports = ButtCommand;
