const {dbClient} = require("../mongodb.js")
const globalFunction = require("../globalfunctions.js")

module.exports = {
	name: 'delete',
	alises: ["d", "Delete", "del"],
	execute(message, args) {
		let messageID = args[0]
		var channelID = args[1]
		if (args.length == 0 || channelID == undefined || messageID == undefined) return message.channel.send("See `g!delete <Message ID> <#Channel>`")
		//checks if there is any bad input	
		channelID = channelID.split("").slice(2,channelID.length-1).join("")
		
		let deleteChannel = message.guild.channels.cache.find(ch => ch.id === channelID)
		
		if (deleteChannel.name === "suggested-guide-changes") {
			//case when delete channel is suggested-guide-changes
			deleteChannel.messages.fetch({around: messageID, limit: 1})
			.then(msg => {
				msg.first().delete()
				message.channel.send("Message found and deleted.")
			})
			
			dbClient.connect(async(err) => {
				let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
				let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()

				let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
				logChannel.send({embed: globalFunction.logAction(message.author.username, message.author.id, 'Delete', suggestion[0].description, deleteChannel.name)}).then(() => {
					suggestionDB.deleteOne({"messageID": messageID})
				})
			})

		} else if (deleteChannel.name === "update-tips") {
			//case when delete channel is update tips
			dbClient.connect(async (err) => {
				let updateDB = dbClient.db("skyblockGuide").collection("Update Tips")
				let findUpdateMsg = await updateDB.find({"currentMsgId": messageID}).toArray()
				let embedMsg = findUpdateMsg[0].msgObject.fields
				var tipsMsg = ""
				embedMsg.map((val, index) => {
					tipsMsg += "`" + index + "`: " + val.value.split(" ").slice(0,5).join(" ") + "..." + "\n"  
				})
				//shows preview of update tip with first 5 words
				message.channel.send(tipsMsg)
				message.channel.send("Type in the number that corresponds to the tip that is going to be deleted.")
				const filter = msg => parseInt(msg.content.trim()) >= 0 && msg.author.id === message.author.id && parseInt(msg.content.trim()) <= embedMsg.length-1
				const collector = message.channel.createMessageCollector(filter, {time: 10000})
				//awaits message from user
				collector.on('collect', msg => {
					let deleteID = parseInt(msg.content.trim())
					embedMsg.splice(deleteID, 1)
					updateDB.updateOne({"identifier": "Update Tips"}, {$set: {"currentMsgId": messageID, "identifier": "Update Tips", "msgObject": findUpdateMsg[0].msgObject}})
					updateDB.updateOne({"messageID": messageID}, {$set: {"messageID": messageID, "categoryTitle": findUpdateMsg[0].msgObject.title, "embedMessage": findUpdateMsg[0].msgObject}})
					
					let updateChannel = message.guild.channels.cache.find(ch => ch.name === "update-tips")
					updateChannel.messages.fetch({around: messageID, limit: 1}).then(m => {
					  m.first().edit({embed: findUpdateMsg[0].msgObject})
					})
					message.channel.send(`The tip with the id of ${deleteID} has been deleted!`)
					
				})
				
			})
		} else if (deleteChannel.name === "skyblock-guide" || deleteChannel.name === "dungeons-guide-n-tips") {
			//case when the delete channel is skyblock-guide or dungeons-guide-n-tips
			deleteChannel.messages.fetch({around: messageID, limit: 1})
			.then(msg => {
				msg.first().delete()
				message.channel.send("Message found and deleted.")
			})
			
			dbClient.connect(async(err) => {
				let guideDB = dbClient.db("skyblockGuide").collection("Guides")
				await guideDB.deleteOne({"messageID": messageID})
			})

			let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
			logChannel.send({embed: globalFunction.logAction(message.author.username, message.author.id, 'Delete', "N/A", deleteChannel.name)})
		}
	},
}