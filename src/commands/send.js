const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { sendHoraireDay } = require("../controller/functions/7am");

module.exports = {
  data: sendHorraire = new SlashCommandBuilder()
  .setName("send")
  .setDescription("Envoyer l'horraire du jour")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run(bot, interaction) {
    sendHoraireDay(bot)
    interaction.reply({embeds: [new EmbedBuilder()
      .setTitle("**Horaire envoyé !**")
      .setColor("#00ff11")
    ],fetchReply: true,
    }).then(sent => {
      setTimeout(() => {
          sent.delete()
      }, 3000);
    });
  }
}