import { AkairoClient, CommandHandler, InhibitorHandler } from "discord-akairo";
import * as DBL from "dblapi.js";

if (!process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN === "") {
    console.error("Could not find the DISCORD_BOT_TOKEN environment variable!");
    process.exit(1);
}

class BBClient extends AkairoClient {
    commandHandler: CommandHandler;
    inhibitorHandler: InhibitorHandler;

    constructor() {
        super({
            ownerID: process.env.BOT_OWNER
        }, {});
        

        this.commandHandler = new CommandHandler(this, {
            directory: __dirname + "/commands",
            prefix: "!!"
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: __dirname + "/inhibitors"
        })

        this.commandHandler.loadAll();
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();
    }
}

const client = new BBClient();
const dbl = new DBL(process.env.TOP_GG_TOKEN, client);

client.on('ready', () => {
	setInterval(() => {
		dbl.postStats(client.guilds.cache.size);
        }, 1800000);
});

client.login(process.env.DISCORD_BOT_TOKEN);

console.log("Butt-Bot Logged in!");