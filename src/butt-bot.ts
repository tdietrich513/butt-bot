import { AkairoClient, CommandHandler } from "discord-akairo";


if (!process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN === "") {
    console.error("Could not find the DISCORD_BOT_TOKEN environment variable!");
    process.exit(1);
}

class BBClient extends AkairoClient {
    commandHandler: CommandHandler;

    constructor() {
        super({}, {});

        this.commandHandler = new CommandHandler(this, {
            directory: __dirname + "/commands",
            prefix: "!!"
        });

        this.commandHandler.loadAll();
    }
}

const client = new BBClient();
client.login(process.env.DISCORD_BOT_TOKEN);
console.log("Butt-Bot Logged in!");