const {dbClient} = require("../mongodb.js")
const globalFunction = require("../globalfunctions.js")

module.exports = {
	name: 'delete',
	alises: ["d", "del"],
	async execute(message, args) {
		var found = false
		let messageID = args[0]
		var channelID = args[1]
		if (args.length == 0 || channelID == undefined || messageID == undefined) return message.channel.send("See `g!delete <Message ID> <#Channel>`")
		//checks if there is any bad input	
		channelID = globalFunction.channelID(channelID)
		
		let deleteChannel = message.guild.channels.cache.find(ch => ch.id === channelID)
		
		deleteChannel.messages.fetch({around: messageID, limit: 1})
			.then(msg => {
				msg.first().delete()
				message.channel.send("Message found and deleted.")
			}).catch(() => {
				found = true
			})
		
		if (found) return message.channel.send("Error. The specified Message ID does not match anything.")
		else if (deleteChannel.name === "suggested-guide-changes") {
			//case when delete channel is suggested-guide-changes
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()
			let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
			logChannel.send({embed: globalFunction.logAction(message.author.username, message.author.id, 'Delete', suggestion[0].description, deleteChannel.name)}).then(() => {
				suggestionDB.deleteOne({"messageID": messageID})
			})

		} else if (deleteChannel.name === "skyblock-guide" || deleteChannel.name === "dungeons-guide-n-tips") {
			//case when the delete channel is skyblock-guide or dungeons-guide-n-tips
			let guideDB = dbClient.db("skyblockGuide").collection("Guides")
			let guideMsg = await guideDB.find({"messageID": messageID}).toArray()
			if (guideMsg[0] == undefined) return message.channel.send("The given message ID was copied wrong. Please check the Message ID.")
			
			let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
			logChannel.send({embed: globalFunction.logAction(message.author.username, message.author.id, 'Delete', "See below.", deleteChannel.name)})
			logChannel.send({embed: guideMsg[0].embedMessage}).then(()=> guideDB.deleteOne({"messageID": messageID}))
			
		}
	},
}