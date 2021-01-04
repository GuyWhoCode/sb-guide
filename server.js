const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const prefix = 'g!'
const {restrictedCmds, verifiedRoles, cooldownCmds} = require("./constants.js")
const globalFunction = require("./globalfunctions.js")

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`)
	client.commands.set(command.name, command)
}
const cooldowns = new Discord.Collection()

client.once('ready', () => {
	client.user.setActivity("g!help", {type: "WATCHING"})
})

client.on('message', (message) => {
	if (message.author.bot) return;
	console.log("Normal prefix: " + !message.content.startsWith(prefix))
	console.log("Mobile prefix: " + !message.content.startsWith("G!"))
	if (!message.content.startsWith(prefix) || !message.content.startsWith("G!")) return;
	//weeds out messages that don't start with the prefix and the author of the message is a bot.

	if (message.channel.name != "guide-discussion" && message.channel.name != "bot-testing") {
		message.delete({timeout: 15000})
		return message.reply("Wrong channel. Please use <#772948480972161044>!").then(msg => msg.delete({ timeout: 15000}))
	}
		//weeds out messages that aren't in the proper channel.

	if (message.member.roles.cache.find(role => role.name == "Guide Locked")) return message.channel.send("You have been locked from suggesting anything.")
	//weeds out messages that are sent by users who have been locked for moderation purposes.

	// return message.channel.send("This bot is currently under maintenance. See <#772940891354300416> for the reason why. Sorry for the inconvenience! - Mason")

	var args = message.content.slice(prefix.length).trim().split(/ +/)
	var command = args.shift().toLowerCase()

	if (command.includes("\n")) {
		let splitCmd = command.split("\n")[1]
		command = command.split("\n")[0]
		args = [splitCmd, ...args]
	}
	//edge case when a user includes a new line when they enter a cmd
	//ex. g!sbsuggest\nMy New suggestion!

	if (!cooldowns.has("sbsuggest")) cooldowns.set("sbsuggest", new Discord.Collection())
	if (!cooldowns.has("dsuggest")) cooldowns.set("dsuggest", new Discord.Collection())
	if (!cooldowns.has("update")) cooldowns.set("update", new Discord.Collection())
	if (!cooldowns.has("start")) cooldowns.set("start", new Discord.Collection())

	const now = Date.now()

	try {
		let userCmd = client.commands.get(command) || client.commands.find(cmd => cmd.alises && cmd.alises.includes(command))

		if (globalFunction.checkAliases(cooldownCmds, userCmd.name)) {
			const timestamp = cooldowns.get(userCmd.name)
			var cooldown = 0
			if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Discord Management" || role.name == "Contributor")) cooldown = 0
			else if (message.member.roles.cache.find(role => globalFunction.checkAliases(verifiedRoles, role.name))) cooldown = globalFunction.timeToMS("1m")
			else cooldown = globalFunction.timeToMS("3m")

			if (timestamp.has(message.author.id)) {
				const expiration = timestamp.get(message.author.id) + cooldown
				
				if (now < expiration) {
					let timeLeft = (expiration - now) / 1000
					return message.reply("you are still on cooldown for " + timeLeft.toFixed(1) + " seconds.")
				}
			} else {
				timestamp.set(message.author.id, now)
				setTimeout(() => timestamp.delete(message.author.id), cooldown)
			}
		}
		if (globalFunction.checkAliases(restrictedCmds, userCmd.name)) {
			if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Discord Management" || role.name == "Contributor")) userCmd.execute(message, args)
			else message.channel.send("You do not have permission to run this command!")
		} else {
			userCmd.execute(message, args)
		}
		//checking roles to allow users with certain roles (Contributor or Discord Staff) to access restrictive commands

	} catch (error) {
		message.channel.send("There was an error in excuting that command.")
		message.channel.send("Error message: " + error)
	}

})

client.login(process.env.botToken)