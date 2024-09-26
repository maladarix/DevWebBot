const { getGroups, writeGroups } = require("../controllerData")
const arrayCours = require("../../arraysCours");
const user = require("../../user");
const { sendError } = require("../controllerMessages");

function addGroup(bot, interaction) {
  let groups = getGroups()  
  if(groups.math == undefined) {
    groups = new arrayCours()
  }
  
  switch (interaction.customId.split("/")[2]) {
    case "Outils mathématiques":
      if(!groups.math.includes(user => user.id == interaction.member.id)) {
        groups.math.push([new user(interaction.member)])
      }else{
        sendError("Tu es déjà dans un groupe pour ce projet", interaction)
      }
      break;
  
    default:
      break;
  }

  writeGroups(groups)
}

module.exports = { addGroup }