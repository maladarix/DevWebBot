const { addGroup, joinGroup } = require("./controller/functions/gestionGroupes");

function commandHandler(bot, interaction) {
  if (
    !interaction.isCommand() &&
    !interaction.isButton() &&
    !interaction.isStringSelectMenu() &&
    !interaction.isAutocomplete()
  ) {
    return;
  }

  const { commandName } = interaction;
  switch (commandName ? commandName : interaction.customId.split("/")[0]) {
    case "addclass":
      bot.commands.get("addclass").run(bot, interaction)
      break
    
    case "send":
      bot.commands.get("send").run(bot, interaction)
      break

    case "createproject":
      bot.commands.get("createproject").run(bot, interaction)
      break

    case "addGroup":
      addGroup(bot, interaction)
      break

    case "teamSelector":
      joinGroup(bot, interaction)
      break
  }
}

module.exports = { commandHandler };