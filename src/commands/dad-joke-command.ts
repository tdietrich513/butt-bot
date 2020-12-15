import { Command } from "discord-akairo";
import { Message } from "discord.js";

import * as https from "https";

interface SearchResult {
    current_page: number;
    limit: number;
    next_page: number;
    previous_page: number;
    results: { id: string; joke: string; }[]
    search_term: string;
    status: number;
    total_jokes: number;
    total_pages: number;
}
class DadJokeCommand extends Command {
    channelLastPost: Map<string, Date> = new Map();
    
    constructor() {
        super('dadjoke', {
	    prefix: "!!",
            aliases: ["dadjoke"],
            category: 'random',
            args: [{
                id: 'search',
                type: 'string',
                default: ''
            }]
        });
    }

    exec(message: Message, args: { search: string }): any {
        if (!args || args.search == '') {
            this.randomJoke(message);
            return;
        }

        this.searchJoke(message, args.search);
        return;
    }

    searchJoke(message: Message, search: string) : any {
        const options: https.RequestOptions = {
            headers: {
                'User-Agent': 'butt-bott (https://github.com/tdietrich513/butt-bot)',
                'Accept': 'application/json'
            }
        }

        https.get(`https://icanhazdadjoke.com/search?term=${search}`, options, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });

            res.on("error", () => {
                console.log("Error fetching dad joke. :(");
            });

            res.on("end", () => {
                const searchResult: SearchResult = JSON.parse(body);
                console.log(JSON.stringify(searchResult));
                if (searchResult.status != 200) {
                  this.type(message, `Sorry, I can't think of a dad joke about ${search}.`);
                  return;
                }
                if (searchResult.total_jokes == 0) {
                   this.type(message, `If there's a dad joke about ${search}, I haven't heard it.`);
                   return;
                }

                let randomJokeIndex = Math.floor(Math.random() * searchResult.total_jokes > 20 ? 19 : searchResult.total_jokes - 1);
                console.log(`Selected joke ${randomJokeIndex}`);
                this.type(message, searchResult.results[randomJokeIndex].joke);
                return;
            });
        });
    }

    randomJoke(message: Message): any {
        const options: https.RequestOptions = {
            headers: {
                'User-Agent': 'butt-bott (https://github.com/tdietrich513/butt-bot)',
                'Accept': 'text/plain'
            }
        };

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
               this.type(message, body)
            });
        });
    }
    
    type(message: Message, content: string) {
        message.channel.startTyping();
        setTimeout(() => {
            message.channel.stopTyping();
            message.channel.send(content);
        }, Math.floor(content.length /.012));
    }
}

module.exports = DadJokeCommand;
