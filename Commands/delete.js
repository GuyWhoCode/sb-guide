const {dbClient} = require("../mongodb.js")

//Deletes, doubles as a bulk delete command for staff members.
module.exports = {
	name: 'delete',
	description: 'Deletes a suggestion or a section from the guide.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("See `g!delete <Message ID> <Channel>`")
		if (message.member.roles.cache.find(role => role.name == "Discord Staff") || message.member.roles.cache.find(role => role.name == "Discord Management")) {
			let messageID = args[0]
			var channelID = args[1]
			channelID = channelID.split("").slice(2,channelID.length-1).join("")
			
			if (channelID.length == 0) return message.channel.send("Please specify a channel where the intended deleted message is. `g!delete <Message ID> <Channel>`")

			let deleteChannel = message.guild.channels.cache.find(ch => ch.id === channelID)
			
			if (deleteChannel.name === "suggested-guide-changes") {
				deleteChannel.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
					msg.first().delete()
					message.channel.send("Message found and deleted.")
				})
				
				dbClient.connect(async(err) => {
					let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
					await suggestionDB.deleteOne({"messageID": messageID})
				})
			} else if (deleteChannel.name === "update-tips") {
				dbClient.connect(async (err) => {
					let updateDB = dbClient.db("skyblockGuide").collection("Update Tips")
					let findUpdateMsg = await updateDB.find({"currentMsgId": messageID}).toArray()

					let embedMsg = findUpdateMsg[0].msgObject.fields
					var tipsMsg = ""

					embedMsg.map((val, index) => {
						tipsMsg += "`" + index + "`: " + val.value.split(" ").slice(0,5).join(" ") + "..." + "\n"  
					})

					message.channel.send(tipsMsg)
					//Needs to await numbers for 15 seconds.
					
				})
			}

		} else {
			message.channel.send("You don't have permission to use this command!")
		}
		
	},

}