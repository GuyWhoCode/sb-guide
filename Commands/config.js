const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const post = require("../post.js")
const {yesAlias, noAlias, cancelAlias, skycommAffliates, skycommPartners} = require("../constants.js")

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
				},
				{
					name: 'Enable Jumps as Search Result:',
					value: "None"
				},
				{
					name: 'Server Status:',
					value: "None"
				},
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
				configEmbed.fields[1].value = serverSetting.botChannelID.split(",").map(val => val = "<#" + val.trim() + ">").join(", ")
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
			configEmbed.fields[4].value = serverSetting.jumpSearchEnabled == true ? "True" : "False"
			//Jump Search Enabled config
			
			if (message.guild.id == "587765474297905158" || message.guild.id == "807319824752443472") {
				configEmbed.fields[5].value = "Origin Server -- No delay on Guide changes"
			} else if (globalFunctions.checkAliases(skycommAffliates, message.guild.id)) {
				configEmbed.fields[5].value = "Affliate -- 1 day delay on Guide changes"
			} else if (globalFunctions.checkAliases(skycommPartners, message.guild.id)) {
				configEmbed.fields[5].value = "Partner -- 2 day delay on Guide changes"
			} else {
				configEmbed.fields[5].value = "Regular server -- 3 day delay on Guide changes. Consider partnering with Skycomm if you meet the requirements."
			}
			//Server Status
			message.channel.send({embed: configEmbed}) 
			
			return message.channel.send("To change the configuration, run `g!config change`")
		}
		else if (args[0].trim().toLowerCase() != "change" && serverSetting != undefined) return message.channel.send("Check the spelling of the command. `g!config change`")
		//case if the server is found


		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})

		let botConfirm, sbConfirm, dConfirm, jumpConfirm = false
		message.channel.send("Cancel the process with `no` or `cancel` if necessary.\nEnter the desired channel (Ex. #bot-channel) for Bot Commands. If you want to have more than one channel, separate the channels with a comma:")
		
		collector.on('collect', msg => {
			if (botConfirm && sbConfirm && dConfirm && jumpConfirm && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
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
					"dGuideChannelID": globalFunctions.channelID(configEmbed.fields[3].value),
					"jumpSearchEnabled": configEmbed.fields[4].value == "True",
					"initialization": false
				}

				if (serverSetting != undefined) {
					settingsDB.updateOne({"serverID": message.guild.id}, {$set: newEntry})
					//edge case if entry exists. Updates current entry.
				} else {
					settingsDB.insertOne(newEntry)
					//records new entry in database
				}

				message.channel.send("Settings configured!")
				// post.post(message, message.guild.id, "initialize")
				return undefined

			} else if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())) {
				collector.stop()
				message.channel.send("Process canceled.")
				return undefined
				//stops process if given no/cancel alias
			} else if (filter(msg)) {
				let channel = msg.content.trim()

				if (botConfirm && sbConfirm && dConfirm && !jumpConfirm) {
					//confirmation for all settings
					jumpConfirm = true
					if (globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
						configEmbed.fields[4].value = "True"
						configEmbed.fields = configEmbed.fields.slice(0,5)
						message.channel.send({embed: configEmbed})
						return message.channel.send("Confirm that these are the right settings for your server with `yes`")
					} else if (msg.content.trim().toLowerCase() == "none"){
						configEmbed.fields[4].value = "False"
						configEmbed.fields = configEmbed.fields.slice(0,5)
						message.channel.send({embed: configEmbed})
						return message.channel.send("Confirm that these are the right settings for your server with `yes`")
					} else {
						jumpConfirm = false
						return message.channel.send("Invalid input. Please type in either `yes` or `none`")
					}

				} else if (botConfirm && sbConfirm && !dConfirm) {
					//Dungeon Guide Channel confirmed
					
					if (msg.content.includes("#")) {
						configEmbed.fields[3].value = channel
						dConfirm = true
						return message.channel.send("Type in `none` if you want to disable this option. Type `yes` to enable Jump Searching. For larger servers, it is recommended to turn this on since `g!search` returns the whole guide. With this option enabled, it will return a hyperlink to the corresponding guide.\n**You must have a Skyblock and Dungeon Guide Channel.**")
					} else if (msg.content.trim().toLowerCase() == "none") {
						return message.channel.send("Process skipped.")
					}

				} else if (botConfirm && !sbConfirm) {
					//Skyblock Guide Channel confirmed
					
					if (msg.content.includes("#")) {
						sbConfirm = true
						configEmbed.fields[2].value = channel
						return message.channel.send("Type in `none` if you don't want to set this channel. Enter the desired channel (Ex. #bot-channel) for Dungeon Guides:")
					} else if (msg.content.trim().toLowerCase() == "none") {
						return message.channel.send("Process skipped.")
					} 

				} else if (!botConfirm) {
					//Bot Channel confirmed
					
					if (msg.content.includes("#")){
						configEmbed.fields[1].value = channel
						botConfirm = true
						return message.channel.send("Type in `none` if you don't want to set this channel. Enter the desired channel (Ex. #bot-channel) for Skyblock Guides:")
					} 
				}
			} 
			
			return message.channel.send("Invalid input. Please type in a channel (Ex. #bot-channel). It should be highlighted in blue.")
		})
    }
}