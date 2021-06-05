const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {noAlias, cancelAlias} = require("../constants.js")
const post = require("../post.js")

module.exports = {
	name: 'delete',
	alises: ["d", "del"],
	async execute(client, message, args) {
		let messageID = args[0]
		var channelID = args[1]
		var sectionConfirm = false
		if (args.length == 0 || channelID == undefined || messageID == undefined) return message.channel.send("See `g!delete <Message ID> <#Channel>`")
		//checks if there is any bad input	
		channelID = globalFunctions.channelID(channelID)
		let deleteChannel = message.guild.channels.cache.find(ch => ch.id === channelID)
		

		if (deleteChannel.name === "suggested-guide-changes") {
			//case when delete channel is suggested-guide-changes

			deleteChannel.messages.fetch({around: messageID, limit: 1})
			.catch(() => {
				return message.channel.send("Error. The specified Message ID does not match anything.")
			}).then(msg => {
				msg.first().delete()
				message.channel.send("Message found and deleted.")
			})
			
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()
			let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
			logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Delete', suggestion[0].description, deleteChannel.name)}).then(() => {
				suggestionDB.deleteOne({"messageID": messageID})
			})

		} else if (deleteChannel.name === "skyblock-guide" || deleteChannel.name === "dungeons-guide-n-tips") {
			//case when the delete channel is skyblock-guide or dungeons-guide-n-tips
			let guideDB = dbClient.db("skyblockGuide").collection("Guides")
			let guideMsg = await guideDB.find({"messageID": messageID}).toArray()
			//error -- unable to find guide due to backend rework
			if (guideMsg[0] == undefined) return message.channel.send("The given message ID was copied wrong. Please check the Message ID.")

			
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})	

			message.channel.send("Type in `no` or `cancel` to end the process. Specify what portion of the Guide to delete: `all` or `section`")
			collector.on('collect', async(msg) => {
				if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
					collector.stop()
					return message.channel.send("Process canceled.")
					//stops process if given no/cancel alias

				} else if (sectionConfirm) {
					collector.stop()
					var sectionInfo, guideChannel = ""
					guideMsg[0].embedMessage.fields.map((val, index) => {
						if (val.name != "_ _" && val.name == msg.content.trim()) {
							sectionInfo = val.value
							delete guideMsg[0].embedMessage.fields[index]
						}
					})

					guideMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
					
					guideMsg[0].embedMessage.timestamp = new Date()
					guideChannel.messages.fetch({around: guideMsg[0].messageID, limit: 1}).then(m => {
						m.first().edit({embed: guideMsg[0].embedMessage}).then(me => {message.channel.send("ID: " + me.id)})
					})

					let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
					logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Delete', sectionInfo, guideMsg[0].categoryTitle)})
					guideDB.updateOne({"messageID": guideMsg[0].messageID}, {$set: {"embedMessage": guideMsg[0].embedMessage, "categoryTitle": guideMsg[0].categoryTitle, "messageID": guideMsg[0].messageID, "category": guideMsg[0].category}})
					// post.post(client, message, "", "edit", guideMsg[0].categoryTitle)
					// post function
					return message.channel.send("Section deleted.")

				} else if (msg.content.trim().toLowerCase() == "section" && !sectionConfirm) {
					var sectionList = ""
					guideMsg[0].embedMessage.fields.map(val => {
						if (val.name != "_ _") {
							sectionList += val.name + "\n"
						}
					})
					sectionConfirm = true
					return message.channel.send("Enter the name of the section that you want to delete. All of the sections are provided below:\n" + "```" + sectionList +"```")	
					//Prompts the user for the section name after selection the section option.	

				} else if (msg.content.trim().toLowerCase() == "all") {
					collector.stop()
					let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
					logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Delete', "See below.", deleteChannel.name)})
					logChannel.send({embed: guideMsg[0].embedMessage}).then(()=> guideDB.deleteOne({"messageID": messageID}))
					// post.post(client, message, "", "delete", guideMsg[0].categoryTitle)
					// post function
		

					deleteChannel.messages.fetch({around: messageID, limit: 1})
						.catch(() => {
							return message.channel.send("Error. The specified Message ID does not match anything.")
						}).then(msg => {
							msg.first().delete()
							message.channel.send("Message found and deleted.")
						})
					//Deletes the whole guide and records the action in logs.
				}
			})	
		}
	},
}