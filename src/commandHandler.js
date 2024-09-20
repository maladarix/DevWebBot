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
  }
}

module.exports = { commandHandler };