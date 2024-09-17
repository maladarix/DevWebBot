const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { sendError } = require("../controller/controllerMessages");
const { GetHoraires, writeHoraire } = require("../controller/controllerData");
const Cour = require("../templateCour");

module.exports = {
  data: addClass = new SlashCommandBuilder()
  .setName("addclass")
  .setDescription("Ajouter un cour a la database")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option.setName("date")
    .setDescription("La date du cour")
    .setRequired(true)
    .setMaxLength(10)
    .setMinLength(10)
  )
  .addStringOption(option => 
    option.setName("nom")
    .setDescription("Nom du cour")
    .addChoices(
      {name: "Outils mathématiques", value: "Outils mathématiques"},
      {name: "Profession et environnement de travail", value: "Profession et environnement de travail"},
      {name: "Programmation et algorithmes", value: "Programmation et algorithmes"},
      {name: "Développement Web", value: "Développement web"}
    )
    .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("type")
    .setDescription("Type de cour")
    .addChoices(
      {name: "Cour", value: "cour"},
      {name: "Examen", value: "examen"}
    )
    .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("matiere")
    .setDescription("Matière du cour")
    .setRequired(true)
  )
  .addIntegerOption(option => 
    option.setName("numero")
    .setDescription("Numéro de cour")
    .setMinValue(1)
    .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("heurestart")
    .setDescription("Heure de début du cour")
    .addChoices(
      {name: "08:30", value: "08:30"},
      {name: "12:30", value: "12:30"}
    )
    .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("heurefin")
    .setDescription("Heure de fin du cour")
    .addChoices(
      {name: "11:30", value: "11:30"},
      {name: "15:30", value: "15:30"}
    )
    .setRequired(true)
  ),

  async run (bot, interaction) {
    let hoistedOptions = interaction.options._hoistedOptions

    if(Date.parse(hoistedOptions.find(option => option.name == "date").value) == NaN) return sendError("Date invalide", interaction)

    let horaires = GetHoraires()
    
    if(horaires.some(horaire => horaire.numCour == hoistedOptions.find(option => option.name == "numero").value)) return sendError("Ce cour est déjà dans la BDD", interaction)
    
    horaires.push(new Cour(
      hoistedOptions.find(option => option.name == "date").value, 
      hoistedOptions.find(option => option.name == "nom").value,
      hoistedOptions.find(option => option.name == "matiere").value,
      hoistedOptions.find(option => option.name == "numero").value,
      hoistedOptions.find(option => option.name == "heurestart").value,
      hoistedOptions.find(option => option.name == "heurefin").value,
    ))

    writeHoraire(horaires)

    interaction.reply({embeds: [new EmbedBuilder()
      .setTitle("**Cour ajouté**")
      .setColor("#00ff11")
    ],fetchReply: true,
    }).then(sent => {
      setTimeout(() => {
          sent.delete()
      }, 3000);
    });
  }
}