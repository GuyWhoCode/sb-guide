const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const prefix = 'g!'
const {restrictedCmds, verifiedRoles, cooldownCmds, nonSkycommCmds, adEmbed} = require("./constants.js")
const globalFunctions = require("./globalfunctions.js")
const {dbClient} = require("./mongodb.js")

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

client.on('message', async (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) if (!message.content.startsWith(prefix.toUpperCase())) return;
	//weeds out messages that don't start with the prefix and the author of the message is a bot.
	
	let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
	let findServer = await serverInfo.find({"serverID": message.guild.id}).toArray()
	let server = findServer[0]

	if (server != undefined) {
		let rightChannel = false
		server.botChannelID.split(",").map(val => {
			if (message.channel.id == val) rightChannel = true
		})

		if (!rightChannel) {
			let rightChannels = server.botChannelID.split(",").map(val => val = "<#" + val + "> ").join(",")
		
			message.delete({timeout: 15000})
			return message.reply("Wrong channel. Please use " + rightChannels).then(msg => msg.delete({ timeout: globalFunctions.timeToMS("15s")}))
		}
	}
	//wrong channel prevention when server is configurated

	if (message.member.roles.cache.find(role => role.name == "Guide Locked")) return message.channel.send("You have been locked from suggesting anything.")
	//weeds out messages that are sent by users who have been locked for moderation purposes.

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
	if (!cooldowns.has("start")) cooldowns.set("start", new Discord.Collection())

	const now = Date.now()

	try {
		let userCmd = client.commands.get(command) || client.commands.find(cmd => cmd.alises && cmd.alises.includes(command))

		if (message.guild.id != "587765474297905158" && message.guild.id != "807319824752443472") {
		//Remove command restriction on Skycomm (home server) and Test Server (private test server)
			if (globalFunctions.checkAliases(nonSkycommCmds, userCmd.name)) {
				userCmd.execute(message, args)
			} else {
				message.channel.send({embed: adEmbed})
				//sends message advertising Skycomm.
			}
			return undefined
		}
		//protocal when a server is not Skycomm.

		if (globalFunctions.checkAliases(cooldownCmds, userCmd.name)) {
			const timestamp = cooldowns.get(userCmd.name)
			var cooldown = 0
			if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Discord Management" || role.name == "Contributor")) cooldown = 0
			else if (message.member.roles.cache.find(role => globalFunctions.checkAliases(verifiedRoles, role.name))) cooldown = globalFunctions.timeToMS("1m")
			else cooldown = globalFunctions.timeToMS("3m")

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
		//establishes cooldowns
		if (globalFunctions.checkAliases(restrictedCmds, userCmd.name)) {
			if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Discord Management" || role.name == "Contributor")) userCmd.execute(client, message, args)
			else message.channel.send("You do not have permission to run this command!")
		} else {
			userCmd.execute(message, args)
		}
		//checking roles to allow users with certain roles (Contributor or Discord Staff) to access restrictive commands

	} catch (error) {
		message.channel.send("There was an error in excuting that command. Run `g!help` to see a list of possible commands.")
		console.log(error)
	}

})

client.login(process.env.botToken)