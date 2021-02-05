const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")

module.exports = {
    name: "config",
	alises: ['c'],
    async execute(message, args) {
		if (!message.member.permissions.serialize().ADMINISTRATOR) return message.channel.send("You do not have permission to run this command!")

		const configEmbed = {
			color: 0x4ea8de,
			title: 'Server Config',
			fields: [
				{
					name: 'Server ID:',
					value: message.guild.id,
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
		let settingsDB = dbClient.db("skyblockGuide").collection("Settings")
		let findServer = await settingsDB.find({"serverID": message.guild.id}).toArray()
		let serverSetting = findServer[0]
		if (serverSetting != undefined && args[0] == undefined) {
			if (serverSetting.botChannelID.includes(",")) {
				configEmbed.fields[1].value = serverSetting.botChannelID.split(",").map(val => val = "<#" + val + ">").join(", ")
				//accounts for formatting of multiple channels
			} else {
				configEmbed.fields[1].value = "<#" + serverSetting.botChannelID + ">"
				//formatting of a single channel
			}
			//Bot Channel config
			configEmbed.fields[2].value = "<#" + serverSetting.sbGuideChannelID + ">"
			//Skyblock Guides Channel config
			configEmbed.fields[3].value = "<#" + serverSetting.dGuideChannelID + ">"
			//Dungeon Guides Channel config
			message.channel.send({embed: configEmbed}) 
			
			if (args[0].toLowerCase() != "change" && serverSetting != undefined) return message.channel.send("Check the spelling of the command.")
			return message.channel.send("To change the configuration, run `g!config change`")
		}
		//case if the server is found

		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		const collector = message.channel.createMessageCollector(filter, {time: 60000})

		let botConfirm = false
		let sbConfirm = false
		let dConfirm = false
		message.channel.send("Cancel the process with `no` or `cancel` if necessary. Enter the desired channel (Ex. #bot-channel) for Bot Commands. If you want to have more than one channel, separate the channels with a comma:")
		
		collector.on('collect', msg => {
			if (botConfirm && sbConfirm && dConfirm && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
				collector.stop()
				
				if (configEmbed.fields[1].value.includes(",")) {
					configEmbed.fields[1].value = configEmbed.fields[1].value.split(",").map(val => globalFunctions.channelID(val.trim())).join(",")
				} else {
					configEmbed.fields[1].value = globalFunctions.channelID(configEmbed.fields[1].value)
				}
				//sees if there are multiple channels that need to be recorded

				let newEntry = {
					"serverID": message.guild.id,
					"botChannelID": configEmbed.fields[1].value,
					"sbGuideChannelID": globalFunctions.channelID(configEmbed.fields[2].value),
					"dGuideChannelID": globalFunctions.channelID(configEmbed.fields[3].value)
				}

				if (serverSetting != undefined) {
					settingsDB.updateOne({"serverID": message.guild.id}, {$set: {"serverID": message.guild.id, "botChannelID": newEntry.botChannelID, "sbGuideChannelID": newEntry.sbGuideChannelID, "dGuideChannelID": newEntry.dGuideChannelID}})
					//edge case if entry exists. Updates current entry.
				} else {
					settingsDB.insertOne(newEntry)
					//records new entry in database
				}

				message.channel.send("Settings configured!")
				return undefined

			} else if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())) {
				//stops Edit process if given no/cancel alias
				collector.stop()
				message.channel.send("Process canceled.")
				return undefined
			
			} else if (filter(msg)) {
				let channel = msg.content.trim()

				if (botConfirm && sbConfirm && !dConfirm) {
					//confirmation for all settings
					dConfirm = true
					if (msg.content.includes("#")) {
						configEmbed.fields[3].value = channel
					} else if (msg.content.toLowerCase() == "none") {
						return message.channel.send("Process skipped.")
					} else {
						dConfirm = false
					}
					
					if (dConfirm) {
						message.channel.send({embed: configEmbed})
						message.channel.send("Confirm that these are the right settings for your server with `yes`")
						return undefined
					}

				} else if (botConfirm && !sbConfirm) {
					//Skyblock Guide Channel confirmed
					sbConfirm = true
					if (msg.content.includes("#")) {
						configEmbed.fields[2].value = channel
					} else if (msg.content.toLowerCase() == "none") {
						return message.channel.send("Process skipped.")
					} else {
						sbConfirm = false
					}
					if (sbConfirm) return message.channel.send("Type in `none` if you don't want to set this channel. Enter the desired channel (Ex. #bot-channel) for Dungeon Guides:")

				} else if (!botConfirm) {
					//Bot Channel confirmed
					botConfirm = true
					if (msg.content.includes("#")) configEmbed.fields[1].value = channel
					else {
						botConfirm = false
					}
					if (botConfirm) return message.channel.send("Type in `none` if you don't want to set this channel. Enter the desired channel (Ex. #bot-channel) for Skyblock Guides:")
				}
			} 
			
			return message.channel.send("Invalid input. Please type in a channel (Ex. #bot-channel). It should be highlighted in blue.")
		})
    }
}