import { Command } from "discord-akairo";
import { Message } from "discord.js";

class HelpCommand extends Command {
  constructor() {
    super("help", {
      prefix: "!!",
      aliases: ["help"],
      cooldown: 3000,
      ratelimit: 1
    });
  }

  exec(message: Message) {
    let help = "I'll occasionally make a joke all by myself when I see people talking.\n";
    help += "Butt if you'd like to trigger a joke, try !!dadjoke or !!butt <some text to make a butt joke with>\n";
    help += "You don't need the <> there, that's just for illustrative purposes.\n";
    help += "You know. Like you do.\n";

    message.react("👍");

    return message.author.send(help);
  }
}

module.exports = HelpCommand;
