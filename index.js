require("dotenv").config();
const { Collection, GatewayIntentBits, Client } = require("discord.js");
const bot = new Client({ intents: GatewayIntentBits.Guilds });
const fs = require('fs');