import { Command } from "discord-akairo";
import { Message } from "discord.js";

import * as https from "https";


class DadJokeCommand extends Command {
    channelLastPost: Map<string, Date> = new Map();

    constructor() {
        super('dadjoke', {
            category: 'random'
        });
    }

    condition(message: Message): boolean {
        if(message.cleanContent.startsWith('!!dadjoke')) return true;

        // reduce probabilities of comment in the time after a comment.
        if(!this.channelLastPost.has(message.channel.id)) this.channelLastPost.set(message.channel.id, new Date());
        const lastCommentTime = this.channelLastPost.get(message.channel.id);
        const minSince = (new Date().getTime() - lastCommentTime.getTime()) / 60000;
        const spamAdjuster = (minSince < 30) ? minSince / 30 : 1;

        // check random against trigger probability.
        const chance = .01 * spamAdjuster;
        const roll = Math.random();
        if (roll > chance) return false;

        this.channelLastPost.set(message.channel.id, new Date());

        return true;
    }

    exec(message: Message, args: any): any {
        const options: https.RequestOptions = {
            headers: {
                'User-Agent': 'butt-bott (https://github.com/tdietrich513/butt-bot)',
                'Accept': 'text/plain'
            }
        }

        https.get('https://icanhazdadjoke.com/', options, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });

            res.on("error", () => {
                console.log("Error fetching dad joke. :(");
            });

            res.on("end", () => {
                message.channel.startTyping();
                setTimeout(() => {
                    message.channel.stopTyping();
                    message.channel.send(body);
                }, Math.floor(body.length /.0066));
            });
        });
    }
}

module.exports = DadJokeCommand;