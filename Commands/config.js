const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")

module.exports = {
    name: "config",
	alises: ['c'],
    async execute(message, args) {
		const configEmbed = {
			color: 0x4ea8de,
			title: 'Server Config',
			fields: [
				{
					name: 'Server ID:',
					value: "None",
				},
				{
					name: 'Bot Channel:',
					value: "None"
				},
				{
					name: 'Skyblock Guides Channel:',
					value: "None"
				},
				{
					name: 'Dungeon Guides Channel:',
					value: "None"
				}
				],
				
			footer: {
				text: 'Skyblock Guides',
				icon_url: "https://i.imgur.com/184jyne.png",
			},
		}
		console.log(message.guild)
		return ""
		// return message.channel.send("Server id")
		let settingsDB = dbClient.db("skyblockGuide").collection("Settings")
		let findServer = await settingsDB.find({"serverID": message.guild.id}).toArray()
		let serverSetting = findServer[0]
		if (serverSetting != undefined) {
			// configEmbed.fields[1].value = 
			//Bot Channel config
			// configEmbed.fields[2].value = 
			//Skyblock Guides Channel config
			// configEmbed.fields[3].value = 
			//Dungeon Guides Channel config
			return message.channel.send({embed: configEmbed})
		}
		//edge case if the server is found
		
		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0 && msg.content.includes("#")
		const collector = message.channel.createMessageCollector(filter, {time: 60000})

		let botConfirm = false
		let sbConfirm = false
		let dConfirm = false
		message.channel.send("Cancel the process with `no` or `cancel` if necessary. Enter the desired channel (Ex. #bot-channel) for Bot Commands:")
		collector.on('collect', msg => {
			if (botConfirm && sbConfirm && dConfirm && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
				collector.stop()
				//records new entry in database
				let newEntry = {
					"serverID": message.guild.id,
					"botChannelID": globalFunctions.channelID(configEmbed.fields[1]),
					"sbGuideChannelID": globalFunctions.channelID(configEmbed.fields[2]),
					"dGuideChannelID": globalFunctions.channelID(configEmbed.fields[3])
				}
				settingsDB.insertOne(newEntry)
				message.channel.send("Settings configured!")

			}
			if (filter(msg)) {
				let channel = msg.content.trim()

				if (botConfirm && sbConfirm && !dConfirm) {
					//confirmation for all settings
					dConfirm = true
					configEmbed.fields[3].value = channel
					message.channel.send({embed: configEmbed})
					message.channel.send("Confirm that these are the right settings for your server with `yes`")

				} else if (botConfirm && !sbConfirm) {
					//Skyblock Guide Channel confirmed
					sbConfirm = true
					configEmbed.fields[2].value = channel
					message.channel.send("Enter the desired channel (Ex. #bot-channel) for Dungeon Guides:")

				} else if (!botConfirm) {
					//Bot Channel confirmed
					botConfirm = true
					configEmbed.fields[1].value = channel
					message.channel.send("Enter the desired channel (Ex. #bot-channel) for Skyblock Guides:")
					
				}
				
			} else if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())) {
				collector.stop()
				return message.channel.send("Process Canceled")
			} else {
				message.channel.send("Invalid input. Please type in a channel (Ex. #bot-channel). It should be highlighted in blue.")
			}
			
		})
    }
}