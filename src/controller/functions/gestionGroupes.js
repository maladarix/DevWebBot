const { getGroups, writeGroups } = require("../controllerData")
const arrayCours = require("../../arraysCours");
const user = require("../../user");
const { sendError } = require("../controllerMessages");
const { EmbedBuilder, embedLength, ChannelType, PermissionsBitField, StringSelectMenuOptionBuilder, User } = require("discord.js");

function addGroup(bot, interaction) {
  let groups = getGroups() 
  let numGroup = 0
  if(groups.math == undefined) {
    groups = new arrayCours()
  }
  
  let classe = findClass(interaction.customId.split("/")[2])

  if(!checkIfInGroup(interaction.member, classe.cour, groups)) {
    groups[classe.cour].push({id: groups[classe.cour].length + 1, name: interaction.message.embeds[0].data.title, chanIds: [], joinMsgId: interaction.message.id, groupe: [new user(interaction.member)]})
    numGroup = groups[classe.cour].length
  }else{
    return sendError("Tu es déjà dans un groupe pour ce projet", interaction)
  }

  Promise.all([
    interaction.guild.channels.create({
      name: `${interaction.customId.split("/")[3]}-Groupe-${numGroup}`,
      type: ChannelType.GuildText,
      parent: classe.parent,
      permissionOverwrites: [
        {
          id: interaction.member.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        },{
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    }).then(chan => {
      groups[classe.cour].find(group => group.id == numGroup).chanIds.push(chan.id)
    }),
    
    interaction.guild.channels.create({
      name: `${interaction.customId.split("/")[3]}-Groupe-${numGroup}`,
      type: ChannelType.GuildVoice,
      parent: classe.parent,
      permissionOverwrites: [
        {
          id: interaction.member.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        },{
          id: interaction.guild.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
          deny: [PermissionsBitField.Flags.Connect]
        }
      ]
    }).then(chan => {
      groups[classe.cour].find(group => group.id == numGroup).chanIds.push(chan.id)
    })
  ]).then(() => {     
    let listeOptions = []
    for (let i = 0; i < groups[classe.cour].length; i++) {
      listeOptions.push({label: `Groupe ${i + 1}`, value: `${i + 1}/${classe.cour}`})
    }
    
    interaction.message.embeds[0].data.description = ""
    interaction.message.components[0].components[0].data.disabled = false
    interaction.message.components[0].components[0].data.options = listeOptions
  
    interaction.message.edit({embeds: [new EmbedBuilder(interaction.message.embeds[0].data)
     .addFields(
       {name: `Groupe ${numGroup}`, value: `- ${new user(interaction.member).displayName}`, inline: true}
      )],
      components: [
        interaction.message.components[0],
        interaction.message.components[1]
      ]})
  
  
    writeGroups(groups)
  
    interaction.reply({embeds: [new EmbedBuilder()
      .setTitle(`Tu as créé le groupe #${numGroup}`)
      .setColor("Green")
    ],
    ephemeral: true
    })
  })
}

function joinGroup(bot, interaction) {
  let groupes = getGroups()

  if(!checkIfInGroup(interaction.member, interaction.values[0].split("/")[1], groupes)) {
    groupes[interaction.values[0].split("/")[1]].find(group => group.id == interaction.values[0].split("/")[0]).groupe.push(new user(interaction.member))

    groupes[interaction.values[0].split("/")[1]].find(group => group.id == interaction.values[0].split("/")[0]).chanIds.forEach(chan => {
      let channel = interaction.guild.channels.cache.get(chan)
  
      channel.permissionOverwrites.edit(
        interaction.member.id, 
        {"ViewChannel": true}
      )
    });
  
    writeGroups(groupes)
  
    interaction.message.embeds[0].data.fields.find(field => field.name == `Groupe ${interaction.values[0].split("/")[0]}`).value += `\n- ${new user(interaction.member).displayName}`
  
    interaction.message.edit({embeds: [interaction.message.embeds[0]]})
  
    interaction.reply({embeds: [new EmbedBuilder()
      .setTitle(`Tu as rejoint le groupe ${interaction.values[0].split("/")[0]}`)
      .setColor("Green")
    ],
    ephemeral: true
    })
  }else{
    return sendError("Tu es déjà dans un groupe pour ce projet", interaction)
  }    
}

function checkIfInGroup(member, cour, groups) {
  for (let i = 0; i < groups[cour].length; i++) {    
    if(groups[cour][i].groupe.some(use => use.id == member.id)) {
      return true
    }
  }
}

function findClass(string) {
  let cour = ""
  let parent = ""
  switch (string) {
    case "Outils mathématiques":
      cour = "math"
      parent = "1288854048530763827"
      break;

    case "Profession et environnement de travail":
      cour = "pro"
      parent = "1288854078490673237"
      break;

    case "Programmation et algorithmes":
      cour = "algo"
      parent = "1288854014116630539"
      break;

    case "Développement web":
      cour = "web"
      parent = "1288854030939852870"
      break
  
    default:
      return sendError("Cour indisponible", interaction)
  }
  return {cour: cour, parent: parent}
}
module.exports = { addGroup, joinGroup, findClass }