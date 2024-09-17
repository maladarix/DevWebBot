require("dotenv").config();
const { Collection, GatewayIntentBits, Client } = require("discord.js");
const bot = new Client({ intents: GatewayIntentBits.Guilds });
const fs = require('fs');
const path = require("path");
const { commandHandler } = require("./src/commandHandler");
const { sendHoraireDay } = require("./src/controller/functions/7am");
const { DateTime } = require("luxon");

bot.commands = new Collection()


setInterval(() => {
  let now = new Date()
  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()
  
  if(currentHour == 7 && currentMinute == 30) {
    sendHoraireDay(bot)
  }
}, 60000);

bot.on("ready", async () => {
  const foldersPath = path.join(__dirname, '/src/commands');
  const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'))
  
  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    bot.commands.set(command.data.name, command);
    await bot.application.commands.create(command.data)
  }
  
  console.log("bot online")
  console.log(new Date().toLocaleString());
  sendHoraireDay(bot)
});

bot.on("interactionCreate", (interaction) => {
  commandHandler(bot, interaction);
});

bot.login(process.env.BOT_TOKEN);