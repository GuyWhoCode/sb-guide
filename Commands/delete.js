const {dbClient} = require("../mongodb.js")

//Deletes, doubles as a bulk delete command for staff members.
module.exports = {
	name: 'delete',
	description: 'Deletes a suggestion or a section from the guide.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("You need to input a Message ID! See `g!delete <Message ID>`")
		if (message.member.roles.cache.find(role => role.name == "Discord Staff") || message.member.roles.cache.find(role => role.name == "Discord Management")) {
			let messageID = args[0]
			let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
			
			suggestionChannel.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().delete()
				  message.channel.send("Suggestion found and deleted.")
				})
			
			dbClient.connect(async(err) => {
				let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
				await suggestionDB.deleteOne({"messageID": messageID})
			})
		} else {
			message.channel.send("You don't have permission to use this command!")
		}
		
	},

}