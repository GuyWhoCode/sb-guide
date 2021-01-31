const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

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

		var newEntry = {
			"serverID": message.guild.id,
			"botChannelID": "placeholder",
			"sbGuideChannelID": "placeholder",
			"dGuideChannelID": "placeholder"
		}
		
		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0 && msg.includes("#")
		const collector = message.channel.createMessageCollector(filter, {time: 60000})

		let botCmd = false
		let sbCmd = false
		let dCmd = false
		message.channel.send("Enter the desired channel (Ex. #bot-channel) for Bot Commands:")
		collector.on('collect', msg => {
			// if (filter(msg)) {
			// 	//globalFunctions.channelID(msg.content.trim())
			// 	botCmd = true
				
			// 	if (botCmd) {
			// 		message.channel.send("Enter the desired channel (Ex. #bot-channel) for Skyblock Guides:")
			// 		sbCmd
			// 		message.channel.send("Enter the desired channel (Ex. #bot-channel) for Dungeon Guides:")
			// 	} else {
					
			// 	}
				
			// } else {
			// 	message.channel.send("Invalid input. Please type in a channel (Ex. #bot-channel). It should be highlighted in blue.")
			// }
			
		})
    }
}