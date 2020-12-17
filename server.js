const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const prefix = 'g!'

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`)
	client.commands.set(command.name, command)
}

//    if (args.length == 0) return message.channel.send("You need! See `g! <Suggestion>`")

client.once('ready', () => {
	client.user.setActivity("g!help", {type: "WATCHING"})
})

client.on('message', (message) => {
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//weeds out messages that don't start with the prefix and the author of the message is a bot.

	if (message.channel.name != "guide-discussion" && message.channel.name != "bot-testing" && message.channel.name != "bot-commands") return message.reply("Wrong channel. Please use <#772948480972161044> or <#587815634641879076>!").then(msg => msg.delete({ timeout: 15000}))
	//weeds out messages that aren't in the proper channel.

	if (message.member.roles.cache.find(role => role.name == "Guide Locked")) return message.channel.send("You have been locked from suggesting anything.")
	//weeds out messages that are sent by users who have been locked for moderation purposes.

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	var command = args.shift().toLowerCase()

	if (command.includes("\n")) command = command.split("\n")[0]

	try {
		let userCmd = client.commands.get(command) || client.commands.find(cmd => cmd.alises && cmd.alises.includes(command))
		userCmd.execute(message, args)
	} catch (error) {
		message.channel.send("There was an error in excuting that command.")
		message.channel.send("Error message: " + error)
	}

})

client.login(process.env.botToken)