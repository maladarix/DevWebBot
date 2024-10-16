const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField } = require("discord.js");
const { getGroups, writeGroups } = require("../controller/controllerData");
const { findClass } = require("../controller/functions/gestionGroupes");
const { sendError } = require("../controller/controllerMessages");


module.exports = {
  data: addProject = new SlashCommandBuilder()
  .setName("endproject")
  .setDescription("Termine un projet")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
    let groups = getGroups()
    let classe = findClass(interaction.options._hoistedOptions.find(option => option.name == "cour").value)

    if(groups[classe.cour] == undefined || groups[classe.cour].length == 0) return sendError("Il n'y a pas de projet dans ce cour", interaction)

    groups[classe.cour].forEach(groupe => {
      groupe.chanIds.forEach(chan => {
        let channel = interaction.guild.channels.cache.get(chan)
        
        if(channel.type == 2) {
          channel.delete()
        }else{
          channel.setParent("1296097500729708586")
          
          groupe.groupe.forEach(user => {
            channel.permissionOverwrites.edit(user.id, {SendMessages: false})
            channel.permissionOverwrites.edit(interaction.guild.id, {ViewChannel: false})
          })
        }
      });

      interaction.reply({
        embeds: [new EmbedBuilder().setTitle(`Le projet a été supprimé !`).setColor("Green")], fetchReply: true
      }).then(sent => {
        setTimeout(() => {
            sent.delete()
        }, 3000);
      });
      
      interaction.channel.fetch("1285224745809350687").then(chann => {
        chann.messages.fetch(groups[classe.cour][0].joinMsgId).then(message => {
          message.delete()
          groups[classe.cour] = []
          writeGroups(groups)
        })
      }) 
    });
  }
}