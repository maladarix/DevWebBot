const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
  data: addProject = new SlashCommandBuilder()
  .setName("createproject")
  .setDescription("Créer un nouveu projet")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option.setName("nom")
    .setDescription("Nom du projet")
    .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("cour")
    .setDescription("Cour du projet")
    .addChoices(
      {name: "Outils mathématiques", value: "Outils mathématiques"},
      {name: "Profession et environnement de travail", value: "Profession et environnement de travail"},
      {name: "Programmation et algorithmes", value: "Programmation et algorithmes"},
      {name: "Développement Web", value: "Développement web"}
    )
    .setRequired(true)
  ),

  async run(bot, interaction) {

    interaction.reply({embeds: [new EmbedBuilder()
    .setTitle(`Projet ${interaction.options._hoistedOptions[0].value}`)
    .setDescription("*Aucune équipe pour le moment*")
    .setColor("#b8ff33")
    ],
    components: [
      new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("teamSelector")
        .setDisabled(true)
        .setPlaceholder("Rejoindre une équipe")
        .addOptions(
          new StringSelectMenuOptionBuilder()
          .setLabel("test")
          .setValue("null")
        )
      ),
      new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`addGroup/${interaction.member.id}/${interaction.options._hoistedOptions.find(option => option.name == "cour").value}/${interaction.options._hoistedOptions.find(option => option.name == "nom").value}`)
        .setStyle("Success")
        .setLabel("Créer une équipe")
      )
    ]})
  }
}