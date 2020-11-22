//Copied and pasted with little adjustments from https://discordjs.guide/command-handling/adding-features.html#reloading-commands
module.exports = {
    name: "reload",
    description: "Reloads a command for testing.",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("There is no command to reload!")
        let commandName = agrs[0].toLowerCase()
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias ${commandName}`)
        delete require.cache[require.resolve(`./${command.name}.js`)]
        
        try {
            const newCommand = require(`./Commands/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}