import { Command } from "discord-akairo";
import { Message } from "discord.js";

import * as https from "https";


class DadJokeCommand extends Command {
    channelLastPost: Map<string, Date> = new Map();

    constructor() {
        super('dadjoke', {
	    prefix: "!!",
            aliases: ["dadjoke"],
            category: 'random'
        });
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
                }, Math.floor(body.length /.012));
            });
        });
    }
}

module.exports = DadJokeCommand;
