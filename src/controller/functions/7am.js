const { DateTime } = require("luxon");
const { GetHoraires, writeHoraire, writeToday } = require("../controllerData");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

function sendHoraireDay(bot) {
  let horaires = GetHoraires()
  let today = DateTime.now().setZone("America/Toronto").toFormat("yyyy/MM/dd")
  let todayClass = []
  let textCours = ""
  
  for (let i = 0; i < horaires.length; i++) {
    if(horaires[i].date == today) {
      todayClass.push(horaires[i])
      textCours +=  `**#${todayClass.length} ${horaires[i].cour}**
                    > Début : **${horaires[i].heureStart}** (<t:${Date.parse(`${today.replaceAll("/", "-")}T${horaires[i].heureStart}`).toString().substring(0,10)}:R>)
                    > Fin : **${horaires[i].heureEnd}** (<t:${Date.parse(`${today.replaceAll("/", "-")}T${horaires[i].heureEnd}`).toString().substring(0,10)}:R>)
                    > Matière : **${horaires[i].matiere}**\n
                    `
      
      horaires.splice(i, 1)
    }
  }

  
  bot.channels.cache.get(process.env.genChan).send({embeds: [new EmbedBuilder()
    .setTitle(DateTime.now().setLocale("fr").toFormat("cccc d LLLL").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))
    .setDescription(`**${todayClass.length}** ${todayClass.length > 1 ? "cours" : "cour"} aujourd'hui\n**[Rejoindre le ZOOM](https://cshawi.omnivox.ca/Login/)**\n\n ${textCours}`)
    .setColor("Aqua")
  ]})

  writeHoraire(horaires)
  writeToday(todayClass)
  
}

module.exports = { sendHoraireDay }