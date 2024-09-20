const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendHoraireDay } = require("../controller/functions/7am");

module.exports = {
  data: sendHorraire = new SlashCommandBuilder()
  .setName("send")
  .setDescription("Envoyer l'horraire du jour")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run(bot, interaction) {
    sendHoraireDay(bot)
  }
}